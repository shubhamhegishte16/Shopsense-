const express = require('express');
const router = express.Router();
const pantryController = require('../controllers/pantryController');
const { protect } = require('../middleware/auth');

// GET /api/pantry — fetch all pantry items for the logged-in user
router.get('/', protect, pantryController.getPantryItems);

module.exports = router;
