const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  normalizedName: { type: String, required: true }, // e.g., "aashirvaad atta" for easier matching
  brand: { type: String },
  category: { type: String }, // e.g., "Groceries", "Electronics"
  defaultUnit: { type: String }, // e.g., "kg", "L", "packet"
  // For product matching across receipts
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
