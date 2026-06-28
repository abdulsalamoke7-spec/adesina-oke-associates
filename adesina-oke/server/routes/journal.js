const express = require('express');
const { body, validationResult } = require('express-validator');
const Journal = require('../models/Journal');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ── GET /api/journal — all entries, newest first (public) ────────────────
router.get('/', async (req, res) => {
  try {
    // Don't send full version history to the public — just current content
    const entries = await Journal.find()
      .select('-versions')
      .sort({ publishedAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

// ── GET /api/journal/:id — single entry (public) ─────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const entry = await Journal.findById(req.params.id).select('-versions');
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entry' });
  }
});

// ── POST /api/journal — create new entry (admin only) ────────────────────
router.post('/', protect, [
  body('title').trim().notEmpty().withMessage('Title required'),
  body('body').trim().notEmpty().withMessage('Content required'),
  body('category').optional().trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const entry = await Journal.create({
      title: req.body.title,
      body: req.body.body,
      category: req.body.category || 'General',
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

// ── PUT /api/journal/:id — edit entry, saves version snapshot (admin) ────
router.put('/:id', protect, [
  body('title').trim().notEmpty().withMessage('Title required'),
  body('body').trim().notEmpty().withMessage('Content required'),
  body('category').optional().trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const entry = await Journal.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });

    // Snapshot the current version before overwriting
    entry.versions.push({
      title: entry.title,
      category: entry.category,
      body: entry.body,
      savedAt: new Date(),
    });

    entry.title = req.body.title;
    entry.category = req.body.category || entry.category;
    entry.body = req.body.body;
    entry.updatedAt = new Date();

    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

// ── POST /api/journal/:id/revert — revert to previous version (admin) ────
router.post('/:id/revert', protect, async (req, res) => {
  try {
    const entry = await Journal.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });

    if (!entry.versions || entry.versions.length === 0) {
      return res.status(400).json({ error: 'No previous versions to revert to' });
    }

    // Pop the most recent snapshot and restore it
    const previous = entry.versions[entry.versions.length - 1];
    entry.versions = entry.versions.slice(0, -1);
    entry.title = previous.title;
    entry.category = previous.category;
    entry.body = previous.body;

    await entry.save();
    res.json({ message: 'Reverted to previous version', entry });
  } catch (err) {
    res.status(500).json({ error: 'Failed to revert entry' });
  }
});

// ── GET /api/journal/:id/versions — version history (admin) ──────────────
router.get('/:id/versions', protect, async (req, res) => {
  try {
    const entry = await Journal.findById(req.params.id).select('title versions');
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json({ title: entry.title, versions: entry.versions.reverse() }); // newest first
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch versions' });
  }
});

// ── DELETE /api/journal/:id (admin only) ─────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    const entry = await Journal.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

module.exports = router;
