const express = require('express');
const { body, validationResult } = require('express-validator');
const Meeting = require('../models/Meeting');
const { protect } = require('../middleware/auth');
const {
  notifyFirmOfBooking,
  confirmClientEmail,
  notifyClientOfStatus,
  smsFirmOfBooking,
  smsClientOfStatus,
} = require('../config/notifications');

const router = express.Router();

const VALID_TIMES = [
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM',
  '2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM',
];

const VALID_AREAS = [
  'Civil Litigation & Dispute Resolution',
  'Corporate & Commercial Law',
  'Anti-Corruption & Governance',
  'Human Rights & Public Interest Law',
  'Policy & Legislative Advisory',
  'Other',
];

// ── GET /api/meetings/slots?date=YYYY-MM-DD — MUST be before /:id ─────────
router.get('/slots', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'date query param required' });

  try {
    const booked = await Meeting.find({ date, status: { $ne: 'cancelled' } }).select('time');
    const bookedTimes = booked.map(m => m.time);
    const available = VALID_TIMES.filter(t => !bookedTimes.includes(t));
    res.json({ date, available, booked: bookedTimes });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch slots' });
  }
});

// ── POST /api/meetings — book a new meeting (public) ──────────────────────
router.post('/', [
  body('firstName').trim().notEmpty().withMessage('First name required'),
  body('lastName').trim().notEmpty().withMessage('Last name required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').trim().notEmpty().withMessage('Phone number required'),
  body('area').isIn(VALID_AREAS).withMessage('Invalid practice area'),
  body('date').matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Date must be YYYY-MM-DD'),
  body('time').isIn(VALID_TIMES).withMessage('Invalid time slot'),
  body('matter').optional().trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, phone, area, date, time, matter } = req.body;

  const today = new Date().toISOString().split('T')[0];
  if (date < today) {
    return res.status(400).json({ error: 'Appointment date cannot be in the past.' });
  }

  try {
    const clash = await Meeting.findOne({
      date,
      time,
      status: { $ne: 'cancelled' },
    });

    if (clash) {
      return res.status(409).json({
        error: `The slot on ${date} at ${time} is already booked. Please choose a different time.`,
      });
    }

    const meeting = await Meeting.create({ firstName, lastName, email, phone, area, date, time, matter });

    notifyFirmOfBooking(meeting);
    confirmClientEmail(meeting);
    smsFirmOfBooking(meeting);

    res.status(201).json({ message: 'Consultation request received.', meeting });
  } catch (err) {
    console.error('Meeting booking error:', err);
    res.status(500).json({ error: 'Failed to save meeting. Please try again.' });
  }
});

// ── GET /api/meetings — list all meetings (admin only) ───────────────────
router.get('/', protect, async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (date) filter.date = date;

    const meetings = await Meeting.find(filter).sort({ date: 1, time: 1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch meetings' });
  }
});

// ── PATCH /api/meetings/:id — confirm or cancel (admin only) ─────────────
router.patch('/:id', protect, [
  body('status').isIn(['confirmed', 'cancelled']).withMessage('Status must be confirmed or cancelled'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });

    notifyClientOfStatus(meeting);
    smsClientOfStatus(meeting);

    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update meeting' });
  }
});

// ── DELETE /api/meetings/:id (admin only) ────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
    res.json({ message: 'Meeting deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete meeting' });
  }
});

module.exports = router;