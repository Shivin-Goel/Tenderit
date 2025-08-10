const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  tender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tender',
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bidAmount: Number,
  bidNote: String,
  documents: [String], // Optional file URLs
  status: {
    type: String,
    enum: ['submitted', 'under review', 'accepted', 'rejected'],
    default: 'submitted'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bid', bidSchema);
