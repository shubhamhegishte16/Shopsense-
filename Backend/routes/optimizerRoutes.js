const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getOptimizerData } = require('../controllers/optimizerController');

// All routes require authentication
router.use(protect);

// GET /api/optimizer
router.get('/', getOptimizerData);

module.exports = router;
