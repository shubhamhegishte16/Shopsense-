const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getOptimizerData, analyzeCart } = require('../controllers/optimizerController');
const { upload } = require('../config/cloudinary');

// Multer error-handling wrapper (must run BEFORE protect so file is available)
function handleUpload(req, res, next) {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
}

// All routes require authentication
router.use(protect);

// GET /api/optimizer
router.get('/', getOptimizerData);

// POST /api/optimizer/analyze-cart
router.post('/analyze-cart', handleUpload, analyzeCart);

module.exports = router;
