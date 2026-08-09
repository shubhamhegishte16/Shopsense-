const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true }, // Cloudinary URL
  storeName: { type: String },
  date: { type: Date, default: Date.now },
  items: [{
    name: String,
    quantity: { type: Number, default: 1 },
    unitPrice: Number,
    totalPrice: Number,
    category: String, // e.g., 'Groceries', 'Electronics'
    brand: String
  }],
  subtotal: Number,
  taxes: Number,
  discounts: Number,
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processed', 'flagged'], default: 'pending' },
  validationStatus: { type: String, enum: ['valid', 'mismatch'], default: 'valid' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Receipt', receiptSchema);
