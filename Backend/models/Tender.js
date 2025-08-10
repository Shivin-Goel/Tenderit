const mongoose = require('mongoose');

const tenderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: String,
  budget: Number,
  deadline: Date,
  documents: [String], // Array of URLs (optional for now)
  status: {
    type: String,
    enum: ['open', 'closed', 'awarded'],
    default: 'open'
  },
  source: {
    type: String,
    enum: ['manual', 'aggregated'],
    default: 'manual'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tender', tenderSchema);
