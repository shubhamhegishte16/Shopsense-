const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  normalizedName: { type: String, required: true }, // e.g., "aashirvaad atta" for easier matching
  brand: { type: String, default: 'Unknown' },
  category: { type: String, default: 'Uncategorized' },
  defaultUnit: { type: String }, 
  price: { type: Number, default: 0 },
  store: { type: String, default: 'Multiple' },
  recallStatus: { type: String, enum: ['None', 'Recalled'], default: 'None' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (!this.normalizedName) {
    this.normalizedName = this.name.toLowerCase().trim();
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
