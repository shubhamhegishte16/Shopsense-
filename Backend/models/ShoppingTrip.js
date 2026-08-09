const mongoose = require('mongoose');

const shoppingTripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiptIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Receipt' }],
  storeName: { type: String },
  date: { type: Date, default: Date.now },
  totalSpent: { type: Number, default: 0 },
  totalSavings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ShoppingTrip', shoppingTripSchema);
