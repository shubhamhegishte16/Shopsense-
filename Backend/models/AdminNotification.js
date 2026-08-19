const mongoose = require('mongoose');

const adminNotificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['new_user', 'new_receipt', 'new_product', 'new_recall', 'system'],
    default: 'system',
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  read: { type: Boolean, default: false },
  relatedModel: { type: String, trim: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('AdminNotification', adminNotificationSchema);
