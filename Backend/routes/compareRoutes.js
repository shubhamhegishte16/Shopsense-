const express = require('express');
const router = express.Router();
const compareController = require('../controllers/compareController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/search-stores', compareController.searchStores);

module.exports = router;
