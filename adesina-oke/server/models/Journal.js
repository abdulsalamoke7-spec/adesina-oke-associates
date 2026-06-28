const mongoose = require('mongoose');

// Each saved version of an entry before it was edited
const versionSchema = new mongoose.Schema({
  title:    String,
  category: String,
  body:     String,
  savedAt:  { type: Date, default: Date.now },
}, { _id: false });

const journalSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true, default: 'General' },
  body:     { type: String, required: true },
  versions: [versionSchema], // full edit history, most recent last
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Journal', journalSchema);
