const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tags: [String],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  issues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Issue',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', projectSchema);