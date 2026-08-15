const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, notificationController.getMyNotifications);
router.patch('/:notificationId/read', protect, notificationController.markNotificationRead);

module.exports = router;
