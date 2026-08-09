const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// All chat routes require authentication
router.post('/message', protect, chatController.sendMessage);
router.get('/history', protect, chatController.getChatHistory);
router.get('/:id', protect, chatController.getChat);
router.delete('/history', protect, chatController.clearHistory);

module.exports = router;
