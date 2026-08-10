const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  updateProfile,
  updatePassword,
  uploadAvatar,
  updatePreferences,
  getActivity,
} = require('../controllers/profileController');
const { upload } = require('../config/cloudinary');

router.use(protect);

// @route  PUT /api/profile
router.put('/', updateProfile);

// @route  PUT /api/profile/password
router.put('/password', updatePassword);

// @route  POST /api/profile/avatar
router.post('/avatar', upload.single('avatar'), uploadAvatar);

// @route  PUT /api/profile/preferences
router.put('/preferences', updatePreferences);

// @route  GET /api/profile/activity
router.get('/activity', getActivity);

module.exports = router;
