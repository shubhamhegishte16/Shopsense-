const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getInsights } = require('../controllers/insightsController');

// All routes require authentication
router.use(protect);

// GET /api/insights
router.get('/', getInsights);

module.exports = router;
