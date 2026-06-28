const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true, lowercase: true },
  phone:     { type: String, required: true, trim: true },
  area:      { type: String, required: true },
  date:      { type: String, required: true }, // stored as YYYY-MM-DD
  time:      { type: String, required: true }, // stored as "9:00 AM"
  matter:    { type: String, trim: true, default: '' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

// Compound index — ensures no two active meetings share the same date+time
// (cancelled meetings are allowed to share a slot since they're vacated)
meetingSchema.index({ date: 1, time: 1 });

module.exports = mongoose.model('Meeting', meetingSchema);
