const mongoose = require('mongoose');

const pantryItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unit: { type: String },
  category: { type: String },
  estimatedExpiryDate: { type: Date },
  addedFromReceiptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Receipt' },
  status: { type: String, enum: ['available', 'low_stock', 'consumed', 'expired'], default: 'available' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PantryItem', pantryItemSchema);
