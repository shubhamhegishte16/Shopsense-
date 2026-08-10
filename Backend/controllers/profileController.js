const User = require('../models/User');
const { uploadToCloudinary } = require('../config/cloudinary');
const bcrypt = require('bcryptjs');

// ─── Update Profile Information ─────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, location, dateOfBirth, gender, bio } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields if provided
    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
    if (gender !== undefined) user.gender = gender;
    if (bio !== undefined) user.bio = bio;

    await user.save({ validateModifiedOnly: true });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: user.toSafeObject()
    });

  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

// ─── Update Password ────────────────────────────────────────────────────────
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide both current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    // We need to fetch the password explicitly since it's `select: false`
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });

  } catch (error) {
    console.error('Update Password Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update password' });
  }
};

// ─── Upload Avatar ──────────────────────────────────────────────────────────
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    // Upload to Cloudinary using memory buffer
    const avatarUrl = await uploadToCloudinary(req.file.buffer, req.file.mimetype, 'shopsense_avatars');

    // Update user record
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.avatar = avatarUrl;
    await user.save({ validateModifiedOnly: true });

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      avatarUrl,
      user: user.toSafeObject()
    });

  } catch (error) {
    console.error('Upload Avatar Error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload profile picture' });
  }
};

// ─── Update Preferences ─────────────────────────────────────────────────────
exports.updatePreferences = async (req, res) => {
  try {
    const allowed = ['smartRecommendations', 'priceDropAlerts', 'darkMode', 'weeklySummary', 'currency', 'language', 'monthlyBudget'];
    const updates = {};
    allowed.forEach(key => {
      if (req.body[key] !== undefined) updates[`preferences.${key}`] = req.body[key];
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: false }
    );

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'Preferences updated', user: user.toSafeObject() });
  } catch (error) {
    console.error('Update Preferences Error:', error);
    res.status(500).json({ success: false, message: 'Failed to update preferences' });
  }
};

// ─── Get Activity Feed ──────────────────────────────────────────────────────
exports.getActivity = async (req, res) => {
  try {
    const Receipt = require('../models/Receipt');
    const PantryItem = require('../models/PantryItem');

    // Fetch recent receipts
    const receipts = await Receipt.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // Fetch recent pantry items
    const pantryItems = await PantryItem.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const events = [];

    receipts.forEach(r => {
      events.push({
        label: `Receipt scanned from ${r.storeName || 'Unknown Store'} — ₹${r.totalAmount || 0}`,
        time: r.createdAt,
        color: '#10B981',
        iconName: 'ReceiptText'
      });
    });

    pantryItems.forEach(p => {
      events.push({
        label: `Pantry item added — ${p.name}`,
        time: p.createdAt,
        color: '#8B5CF6',
        iconName: 'Package'
      });
    });

    // Sort all events by time descending
    events.sort((a, b) => new Date(b.time) - new Date(a.time));

    // Format time strings
    const now = new Date();
    const formattedEvents = events.slice(0, 15).map(ev => {
      const d = new Date(ev.time);
      const diffMs = now - d;
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      let timeStr;
      if (diffHrs < 1) timeStr = 'Just now';
      else if (diffHrs < 24) timeStr = `${diffHrs}h ago, Today`;
      else if (diffDays === 1) timeStr = 'Yesterday';
      else timeStr = `${diffDays} days ago`;

      return { label: ev.label, time: timeStr, color: ev.color, iconName: ev.iconName };
    });

    res.json({ success: true, activity: formattedEvents });
  } catch (error) {
    console.error('Get Activity Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch activity' });
  }
};
