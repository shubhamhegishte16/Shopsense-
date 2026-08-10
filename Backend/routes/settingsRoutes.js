const express = require('express');
const router = express.Router();
const { getSettings, updateSettings, toggleConnectedApp } = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

// All settings routes require authentication
router.use(protect);

// GET  /api/settings          – fetch full settings object
router.get('/', getSettings);

// PUT  /api/settings          – update a settings section
router.put('/', updateSettings);

// PUT  /api/settings/connected-apps/:appName  – toggle app connection
router.put('/connected-apps/:appName', toggleConnectedApp);

module.exports = router;
