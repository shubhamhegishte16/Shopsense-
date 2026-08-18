const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['admin_note', 'receipt', 'recall', 'system', 'pantry', 'profile', 'compare'],
    default: 'system',
  },
  relatedModel: { type: String, trim: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  read: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
