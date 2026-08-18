const mongoose = require('mongoose');

const issueReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  issueDescription: {
    type: String,
    required: [true, 'Issue description is required'],
    maxlength: [500, 'Issue description cannot exceed 500 characters'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending'
  },
  adminResponse: {
    type: String,
    maxlength: [500, 'Admin response cannot exceed 500 characters'],
    trim: true,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('IssueReport', issueReportSchema);
