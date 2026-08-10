const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

// Multer error-handling wrapper (must run BEFORE protect so file is available)
function handleUpload(req, res, next) {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer Error:', err.message);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}

// POST /api/receipts/upload — auth required
router.post('/upload', handleUpload, protect, receiptController.uploadReceipt);

// GET /api/receipts — auth required
router.get('/', protect, receiptController.getReceipts);

// DELETE /api/receipts/:id — auth required
router.delete('/:id', protect, receiptController.deleteReceipt);

module.exports = router;
