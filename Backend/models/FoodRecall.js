const mongoose = require('mongoose');

const foodRecallSchema = new mongoose.Schema({
  recallId: { type: String, required: true, unique: true },
  product: { type: String, required: true },
  brand: { type: String },
  category: { type: String },
  reason: { type: String, required: true },
  severity: { type: String, enum: ['High', 'Medium', 'Low'], default: 'High' },
  recallDate: { type: Date },
  effectiveDate: { type: Date },
  issuedByAuthority: { type: String },
  referenceNo: { type: String },
  description: { type: String, maxlength: 500 },
  affectedRegion: { type: String },
  affectedUsers: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Draft', 'Inactive', 'Expired'], default: 'Active' },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('FoodRecall', foodRecallSchema);
