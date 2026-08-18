const mongoose = require('mongoose');

const communityMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [500, 'Message cannot exceed 500 characters'],
    trim: true
  },
  type: {
    type: String,
    enum: ['user_chat', 'admin_announcement', 'food_recall'],
    default: 'user_chat'
  },
  recallReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodRecall',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CommunityMessage', communityMessageSchema);
