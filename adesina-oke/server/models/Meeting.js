const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true, lowercase: true },
  phone:     { type: String, required: true, trim: true },
  area:      { type: String, required: true },
  date:      { type: String, required: true },
  time:      { type: String, required: true },
  matter:    { type: String, trim: true, default: '' },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

meetingSchema.index({ date: 1, time: 1 });

module.exports = mongoose.model('Meeting', meetingSchema);