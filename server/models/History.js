const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String, // e.g., 'C++', 'Python', 'JavaScript'
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String, // URL to the generated audio file
    default: null
  },
  visualData: {
    type: mongoose.Schema.Types.Mixed, // Flexible schema for various visualization parameters
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('History', HistorySchema);
