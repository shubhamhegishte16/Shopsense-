const mongoose = require('mongoose');
const User = require('../models/User');
const Receipt = require('../models/Receipt');
const Notification = require('../models/Notification');
const AdminNotification = require('../models/AdminNotification');
const Product = require('../models/Product');
const PantryItem = require('../models/PantryItem');
const FoodRecall = require('../models/FoodRecall');
const IssueReport = require('../models/IssueReport');
const CommunityMessage = require('../models/CommunityMessage');

function escapeRegex(value = '') {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function objectId(value) {
  return new mongoose.Types.ObjectId(value);
}

exports.getUsers = async (req, res) => {
  try {
    const search = req.query.search?.trim();
    const match = search
      ? { $or: [{ fullName: new RegExp(escapeRegex(search), 'i') }, { email: new RegExp(escapeRegex(search), 'i') }] }
      : {};

    const users = await User.find(match)
      .select('fullName email avatar phone location role accountStatus createdAt lastLogin suspensionReason suspendedAt')
      .sort({ createdAt: -1 })
      .lean();

    const userIds = users.map((user) => user._id);
    const receiptStats = await Receipt.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', receipts: { $sum: 1 }, totalSpending: { $sum: '$totalAmount' }, latestReceiptAt: { $max: '$createdAt' } } },
    ]);
    const statsByUser = new Map(receiptStats.map((row) => [String(row._id), row]));

    const rows = users.map((user) => {
      const stats = statsByUser.get(String(user._id)) || {};
      return {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        location: user.location,
        role: user.role,
        status: user.accountStatus || 'active',
        registeredOn: user.createdAt,
        lastActive: user.lastLogin || stats.latestReceiptAt || user.createdAt,
        receipts: stats.receipts || 0,
        totalSpending: Number(stats.totalSpending || 0),
        reportedIssues: 0,
        suspensionReason: user.suspensionReason,
        suspendedAt: user.suspendedAt,
      };
    });

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    res.json({
      success: true,
      stats: {
        totalUsers: rows.length,
        newUsersThisWeek: rows.filter((user) => new Date(user.registeredOn) >= weekAgo).length,
        activeUsers: rows.filter((user) => user.status === 'active').length,
        suspendedUsers: rows.filter((user) => user.status === 'suspended').length,
        deletedUsers: rows.filter((user) => user.status === 'deleted').length,
      },
      users: rows,
    });
  } catch (error) {
    console.error('Admin getUsers error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('fullName email avatar phone location dateOfBirth gender bio role accountStatus createdAt lastLogin suspensionReason suspendedAt')
      .lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const [receiptStats] = await Receipt.aggregate([
      { $match: { userId: objectId(req.params.userId) } },
      { $group: { _id: '$userId', receipts: { $sum: 1 }, totalSpending: { $sum: '$totalAmount' }, avgReceipt: { $avg: '$totalAmount' } } },
    ]);

    res.json({ success: true, user, stats: receiptStats || { receipts: 0, totalSpending: 0, avgReceipt: 0 } });
  } catch (error) {
    console.error('Admin getUserDetails error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user details' });
  }
};

exports.getUserLatestReceipt = async (req, res) => {
  try {
    const receipt = await Receipt.findOne({ userId: req.params.userId }).sort({ createdAt: -1 }).lean();
    if (!receipt) return res.status(404).json({ success: false, message: 'No receipt found for this user' });
    res.json({ success: true, receipt });
  } catch (error) {
    console.error('Admin latest receipt error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch latest receipt' });
  }
};

exports.setUserSuspension = async (req, res) => {
  try {
    const { suspended = true, reason = '' } = req.body;

    if (String(req.params.userId) === String(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Admins cannot suspend their own account' });
    }

    const target = await User.findById(req.params.userId).select('role fullName accountStatus');
    if (!target) return res.status(404).json({ success: false, message: 'User not found' });
    if (target.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Admin accounts cannot be suspended from this panel' });
    }

    const update = suspended
      ? { accountStatus: 'suspended', suspendedAt: new Date(), suspendedBy: req.user._id, suspensionReason: reason }
      : { accountStatus: 'active', suspendedAt: null, suspendedBy: null, suspensionReason: '' };

    const user = await User.findByIdAndUpdate(req.params.userId, update, { new: true })
      .select('fullName email accountStatus suspendedAt suspensionReason')
      .lean();

    await Notification.create({
      userId: user._id,
      title: suspended ? 'Your account has been suspended' : 'Your account has been reactivated',
      message: suspended
        ? (reason || 'An admin has suspended your account. Please contact support for details.')
        : 'An admin has reactivated your account.',
      type: 'system',
      relatedModel: 'User',
      relatedId: user._id,
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Admin suspension error:', error);
    res.status(500).json({ success: false, message: 'Failed to update user suspension' });
  }
};

exports.getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find({})
      .populate('userId', 'fullName email avatar')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const [stats] = await Receipt.aggregate([
      { $group: {
        _id: null,
        totalReceipts: { $sum: 1 },
        processed: { $sum: { $cond: [{ $eq: ['$status', 'processed'] }, 1, 0] } },
        needsReview: { $sum: { $cond: [{ $eq: ['$validationStatus', 'mismatch'] }, 1, 0] } },
        failed: { $sum: { $cond: [{ $eq: ['$status', 'flagged'] }, 1, 0] } },
      } },
    ]);

    res.json({ success: true, stats: stats || { totalReceipts: 0, processed: 0, needsReview: 0, failed: 0 }, receipts });
  } catch (error) {
    console.error('Admin getReceipts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch receipts' });
  }
};

exports.getReceiptDetails = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.receiptId)
      .populate('userId', 'fullName email avatar')
      .populate('adminNotes.adminId', 'fullName email')
      .lean();
    if (!receipt) return res.status(404).json({ success: false, message: 'Receipt not found' });
    res.json({ success: true, receipt });
  } catch (error) {
    console.error('Admin receipt details error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch receipt details' });
  }
};

exports.addReceiptNote = async (req, res) => {
  try {
    const note = req.body.note?.trim();
    if (!note) return res.status(400).json({ success: false, message: 'Note is required' });

    const receipt = await Receipt.findById(req.params.receiptId);
    if (!receipt) return res.status(404).json({ success: false, message: 'Receipt not found' });

    receipt.adminNotes.push({ note, adminId: req.user._id });
    receipt.activity.push({ label: 'Admin Note', description: note });
    await receipt.save();

    await Notification.create({
      userId: receipt.userId,
      title: 'Admin note on your receipt',
      message: note,
      type: 'admin_note',
      relatedModel: 'Receipt',
      relatedId: receipt._id,
    });

    res.status(201).json({ success: true, notes: receipt.adminNotes, activity: receipt.activity });
  } catch (error) {
    console.error('Admin note error:', error);
    res.status(500).json({ success: false, message: 'Failed to save admin note' });
  }
};



exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    
    const categories = new Set(products.map(p => p.category).filter(Boolean));
    const brands = new Set(products.map(p => p.brand).filter(Boolean));
    
    const activeProducts = products.filter(p => p.status === 'Active').length;
    const recalledProducts = products.filter(p => p.recallStatus === 'Recalled').length;

    res.json({
      success: true,
      stats: {
        totalProducts: products.length,
        activeProducts,
        recalledProducts,
        totalCategories: categories.size,
        totalBrands: brands.size,
      },
      products,
    });
  } catch (error) {
    console.error('Admin getProducts error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, brand, category, price, store, recallStatus, status, defaultUnit } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }

    const product = await Product.create({
      name,
      normalizedName: name.toLowerCase().trim(),
      brand: brand || 'Unknown',
      category: category || 'Uncategorized',
      price: price || 0,
      store: store || 'Multiple',
      recallStatus: recallStatus || 'None',
      status: status || 'Active',
      defaultUnit: defaultUnit || ''
    });

    // Admin notification: new product added manually
    try {
      await AdminNotification.create({
        title: 'New Product Added',
        message: `"${name}" (${brand || 'Unknown'}, ${category || 'Uncategorized'}) was added to the product database.`,
        type: 'new_product',
        priority: 'Low',
        relatedModel: 'Product',
        relatedId: product._id,
        metadata: { productName: name, brand, category },
      });
    } catch (notifErr) {
      console.error('Failed to create admin notification for new product:', notifErr.message);
    }

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Admin createProduct error:', error);
    res.status(500).json({ success: false, message: 'Failed to create product' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    const updates = req.body;
    
    if (updates.name) {
      updates.normalizedName = updates.name.toLowerCase().trim();
    }
    
    const product = await Product.findByIdAndUpdate(productId, updates, { new: true });
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Admin updateProduct error:', error);
    res.status(500).json({ success: false, message: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Admin deleteProduct error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete product' });
  }
};



exports.getAllCommunityMessages = async (req, res) => {
  try {
    const messages = await CommunityMessage.find()
      .populate('sender', 'fullName avatar role')
      .populate('recallReference')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        messages
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.postAdminMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message content cannot be empty' });
    }

    const newMessage = await CommunityMessage.create({
      sender: req.user._id,
      content,
      type: 'admin_announcement'
    });

    await newMessage.populate('sender', 'fullName avatar role');

    res.status(201).json({
      success: true,
      data: {
        message: newMessage
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Admin Notifications ────────────────────────────────────────────────────

exports.getAdminNotifications = async (req, res) => {
  try {
    const notifications = await AdminNotification.find()
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const totalCount = await AdminNotification.countDocuments();
    const unreadCount = await AdminNotification.countDocuments({ read: false });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        stats: {
          total: totalCount,
          unread: unreadCount,
          read: totalCount - unreadCount,
        }
      }
    });
  } catch (error) {
    console.error('Admin getAdminNotifications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAdminNotificationRead = async (req, res) => {
  try {
    const notification = await AdminNotification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    ).lean();
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, data: { notification } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.markAllAdminNotificationsRead = async (req, res) => {
  try {
    await AdminNotification.updateMany({ read: false }, { read: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteAdminNotification = async (req, res) => {
  try {
    const notification = await AdminNotification.findByIdAndDelete(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.postFoodRecall = async (req, res) => {
  try {
    const { recallId, product, brand, category, reason, severity, recallDate, effectiveDate, issuedByAuthority, referenceNo, description, affectedRegion, affectedUsers, status } = req.body;

    const newRecall = await FoodRecall.create({
      recallId,
      product,
      brand,
      category,
      reason,
      severity,
      recallDate: recallDate || undefined,
      effectiveDate: effectiveDate || undefined,
      issuedByAuthority,
      referenceNo,
      description,
      affectedRegion,
      affectedUsers: affectedUsers === '' ? 0 : Number(affectedUsers),
      status,
      adminId: req.user._id
    });

    // Automatically post to community
    const recallMessage = await CommunityMessage.create({
      sender: req.user._id,
      content: `FOOD RECALL: ${product} (${brand}) - ${reason}. ${description}`.substring(0, 500),
      type: 'food_recall',
      recallReference: newRecall._id
    });

    // Notify all users about food recall
    const allUsers = await User.find({}).select('_id');
    const notifications = allUsers.map(u => ({
      userId: u._id,
      title: `Food Recall Alert: ${product}`,
      message: `${brand} ${product} has been recalled. Reason: ${reason}.`,
      type: 'recall',
      relatedModel: 'FoodRecall',
      relatedId: newRecall._id
    }));
    await Notification.insertMany(notifications);

    // Admin notification: new food recall created
    try {
      await AdminNotification.create({
        title: 'New Food Recall Created',
        message: `Food recall "${recallId}" issued for ${product} (${brand}). Severity: ${severity}. Reason: ${reason}.`,
        type: 'new_recall',
        priority: 'High',
        relatedModel: 'FoodRecall',
        relatedId: newRecall._id,
        metadata: { recallId, product, brand, severity, reason },
      });
    } catch (notifErr) {
      console.error('Failed to create admin notification for food recall:', notifErr.message);
    }

    await recallMessage.populate('sender', 'fullName avatar role');
    await recallMessage.populate('recallReference');

    res.status(201).json({
      success: true,
      data: {
        recall: newRecall,
        message: recallMessage
      }
    });
  } catch (error) {
    console.error('Error posting food recall:', error);
    res.status(400).json({ success: false, message: error.message, error });
  }
};

exports.getFoodRecalls = async (req, res) => {
  try {
    const recalls = await FoodRecall.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: {
        recalls
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFoodRecall = async (req, res) => {
  try {
    const recall = await FoodRecall.findById(req.params.id);
    if (!recall) {
      return res.status(404).json({ success: false, message: 'Food recall not found' });
    }

    const allowedFields = ['product', 'brand', 'category', 'reason', 'severity', 'recallDate', 'effectiveDate', 'issuedByAuthority', 'referenceNo', 'description', 'affectedRegion', 'affectedUsers', 'status'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if ((field === 'recallDate' || field === 'effectiveDate') && req.body[field] === '') {
          recall[field] = undefined;
        } else if (field === 'affectedUsers') {
          recall[field] = req.body[field] === '' ? 0 : Number(req.body[field]);
        } else {
          recall[field] = req.body[field];
        }
      }
    }

    await recall.save();

    // Update the community message if one exists
    const existingMessage = await CommunityMessage.findOne({ recallReference: recall._id });
    if (existingMessage) {
      existingMessage.content = `FOOD RECALL: ${recall.product} (${recall.brand}) - ${recall.reason}. ${recall.description}`.substring(0, 500);
      await existingMessage.save();
    }

    res.status(200).json({ success: true, data: { recall } });
  } catch (error) {
    console.error('Error updating food recall:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteFoodRecall = async (req, res) => {
  try {
    const recall = await FoodRecall.findById(req.params.id);
    if (!recall) {
      return res.status(404).json({ success: false, message: 'Food recall not found' });
    }

    const { product, brand, reason } = recall;

    // Remove associated community message
    await CommunityMessage.deleteMany({ recallReference: recall._id });

    // Delete the recall
    await FoodRecall.findByIdAndDelete(req.params.id);

    // Notify all users that the recall has been removed
    const allUsers = await User.find({}).select('_id');
    const notifications = allUsers.map(u => ({
      userId: u._id,
      title: `Food Recall Removed: ${product}`,
      message: `The food recall for ${brand} ${product} (Reason: ${reason}) has been removed as it was found to be a false recall.`,
      type: 'recall',
      relatedModel: 'FoodRecall',
      relatedId: req.params.id
    }));
    await Notification.insertMany(notifications);

    res.status(200).json({ success: true, message: 'Food recall deleted and users notified' });
  } catch (error) {
    console.error('Error deleting food recall:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllIssues = async (req, res) => {
  try {
    const issues = await IssueReport.find()
      .populate('user', 'fullName email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        issues
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateIssue = async (req, res) => {
  try {
    const issueId = req.params.id;
    const { status, adminResponse } = req.body;

    const issue = await IssueReport.findById(issueId);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    if (status) issue.status = status;
    if (adminResponse !== undefined) issue.adminResponse = adminResponse;

    await issue.save();

    res.status(200).json({
      success: true,
      data: {
        issue
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Admin Profile ──────────────────────────────────────────────────────────

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.status(200).json({ success: true, data: { profile: admin.toSafeObject() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAdminProfile = async (req, res) => {
  try {
    const { fullName, email, phone, employeeId, dateOfBirth, department, language } = req.body;

    const admin = await User.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    if (fullName) admin.fullName = fullName;
    if (email) admin.email = email;
    if (phone !== undefined) admin.phone = phone;
    if (employeeId !== undefined) admin.employeeId = employeeId;
    if (dateOfBirth !== undefined) admin.dateOfBirth = dateOfBirth;
    if (department !== undefined) admin.department = department;
    
    if (language) {
      if (!admin.settings) admin.settings = {};
      if (!admin.settings.general) admin.settings.general = {};
      admin.settings.general.language = language;
    }

    await admin.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'Profile updated successfully', data: { profile: admin.toSafeObject() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAdminPreferences = async (req, res) => {
  try {
    const { theme, defaultView, itemsPerPage, timeFormat, dateFormat } = req.body;

    const admin = await User.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    if (!admin.settings) admin.settings = {};
    if (!admin.settings.general) admin.settings.general = {};
    if (!admin.settings.displayPreferences) admin.settings.displayPreferences = {};

    if (theme) admin.settings.general.theme = theme;
    if (timeFormat) admin.settings.general.timeFormat = timeFormat;
    if (dateFormat) admin.settings.general.dateFormat = dateFormat;
    if (defaultView) admin.settings.displayPreferences.defaultView = defaultView;
    if (itemsPerPage) admin.settings.displayPreferences.itemsPerPage = itemsPerPage;

    await admin.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'Preferences updated successfully', data: { profile: admin.toSafeObject() } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new passwords are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const admin = await User.findById(req.user._id).select('+password');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }

    admin.password = newPassword;
    await admin.save(); // password will be hashed by the pre-save hook

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Admin Dashboard Stats ───────────────────────────────────────────────────

exports.getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    // ── 1. Run all DB queries in parallel ────────────────────────────────────
    const [
      totalUsers,
      newUsers,
      totalReceipts,
      processedReceipts,
      failedReceipts,
      totalProducts,
      activeRecalls,
      openIssues,
      userGrowthRaw,
      receiptStatusRaw,
      topCategoriesRaw,
      recentIssues,
      recentActivity,
    ] = await Promise.all([
      // Stat cards
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', createdAt: { $gte: sevenDaysAgo } }),
      Receipt.countDocuments(),
      Receipt.countDocuments({ status: 'processed' }),
      Receipt.countDocuments({ status: 'flagged' }),
      Product.countDocuments(),
      FoodRecall.countDocuments({ status: 'Active' }),
      IssueReport.countDocuments({ status: 'pending' }),

      // User growth: count signups per day for last 7 days
      User.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo }, role: 'user' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Receipt processing donut
      Receipt.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),

      // Top 5 pantry categories (most purchased)
      PantryItem.aggregate([
        { $match: { category: { $exists: true, $ne: null, $ne: '' } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),

      // Recent community issues (last 4 pending/reviewed)
      IssueReport.find({ status: { $in: ['pending', 'reviewed'] } })
        .sort({ createdAt: -1 })
        .limit(4)
        .populate('user', 'fullName')
        .lean(),

      // Recent activity from admin notifications
      AdminNotification.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    // ── 2. Build User Growth chart data ─────────────────────────────────────
    // Create a day-by-day map for last 7 days
    const growthMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().split('T')[0];
      growthMap[key] = 0;
    }
    userGrowthRaw.forEach(({ _id, count }) => {
      if (_id in growthMap) growthMap[_id] = count;
    });
    const userGrowth = Object.entries(growthMap).map(([date, count]) => ({
      date,
      count,
    }));

    // ── 3. Build Receipt donut data ──────────────────────────────────────────
    const receiptStatusMap = { processed: 0, pending: 0, flagged: 0 };
    receiptStatusRaw.forEach(({ _id, count }) => {
      if (_id in receiptStatusMap) receiptStatusMap[_id] = count;
    });
    const total = totalReceipts || 1; // avoid division by zero
    const receiptDonut = {
      processed: {
        count: receiptStatusMap.processed,
        pct: ((receiptStatusMap.processed / total) * 100).toFixed(1),
      },
      pending: {
        count: receiptStatusMap.pending,
        pct: ((receiptStatusMap.pending / total) * 100).toFixed(1),
      },
      failed: {
        count: receiptStatusMap.flagged,
        pct: ((receiptStatusMap.flagged / total) * 100).toFixed(1),
      },
    };

    // ── 4. Build Top Categories data ─────────────────────────────────────────
    const totalPantryItems = topCategoriesRaw.reduce((sum, c) => sum + c.count, 0) || 1;
    const topCategories = topCategoriesRaw.map(({ _id, count }) => ({
      name: _id,
      count,
      pct: ((count / totalPantryItems) * 100).toFixed(1),
    }));

    // ── 5. Format recent issues ───────────────────────────────────────────────
    const formattedIssues = recentIssues.map((issue) => ({
      id: `#CI-${issue._id.toString().slice(-4).toUpperCase()}`,
      description: issue.issueDescription?.substring(0, 40) + '...' || 'No description',
      category: issue.category || 'General',
      priority: issue.priority || 'Medium',
      status: issue.status === 'pending' ? 'Open' : issue.status === 'reviewed' ? 'In Progress' : 'Resolved',
      createdAt: issue.createdAt,
      userName: issue.user?.fullName || 'Unknown User',
    }));

    // ── 6. Format recent activity ─────────────────────────────────────────────
    const typeIconMap = {
      new_user: 'user',
      new_receipt: 'receipt',
      new_product: 'product',
      new_recall: 'recall',
      system: 'system',
    };
    const formattedActivity = recentActivity.map((n) => ({
      id: n._id,
      title: n.title,
      message: n.message,
      type: n.type,
      icon: typeIconMap[n.type] || 'system',
      createdAt: n.createdAt,
    }));

    // ── 7. System status check ────────────────────────────────────────────────
    const mongoStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    const systemStatus = [
      { name: 'MongoDB', status: mongoStatus },
      { name: 'AI Service (Gemini)', status: process.env.GEMINI_API_KEY ? 'Connected' : 'Not Configured' },
      { name: 'Receipt Processing', status: processedReceipts > 0 ? 'Operational' : 'Idle' },
      { name: 'Cloudinary (Storage)', status: process.env.CLOUDINARY_CLOUD_NAME ? 'Connected' : 'Not Configured' },
      { name: 'Email Service', status: 'Connected' },
    ];

    // ── 8. AI metrics (estimated from receipt data) ───────────────────────────
    const aiRequests = totalReceipts;
    const aiSuccessRate = totalReceipts > 0
      ? ((processedReceipts / totalReceipts) * 100).toFixed(1)
      : '0.0';

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          newUsers,
          totalReceipts,
          processedReceipts,
          failedReceipts,
          totalProducts,
          activeRecalls,
          openIssues,
          aiRequests,
          aiSuccessRate,
        },
        userGrowth,
        receiptDonut,
        topCategories,
        recentIssues: formattedIssues,
        recentActivity: formattedActivity,
        systemStatus,
      },
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Reports & Analytics ─────────────────────────────────────────────────────

exports.getReportsAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const fourteenDaysAgo = new Date(now);
    fourteenDaysAgo.setDate(now.getDate() - 14);

    const [
      totalUsers,
      totalReceipts,
      totalProducts,
      totalRecalls,
      // Amount analyzed: sum of all receipt totalAmounts
      amountResult,
      // Receipts per day for line chart (last 7 days)
      receiptsPerDay,
      // Product categories donut
      productCategories,
      // User growth per day (last 7 days)
      userGrowthRaw,
      // Top active users (most receipts scanned)
      topActiveUsersRaw,
      // Recall alerts per day (last 7 days)
      recallsPerDay,
      // Previous period totals for trend calculation
      prevPeriodUsers,
      prevPeriodReceipts,
      prevPeriodRecalls,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Receipt.countDocuments(),
      Product.countDocuments(),
      FoodRecall.countDocuments(),

      // Sum all receipt amounts
      Receipt.aggregate([
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),

      // Receipts uploaded per day for last 7 days
      Receipt.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
            totalAmount: { $sum: '$totalAmount' },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Product categories from pantry items
      PantryItem.aggregate([
        { $match: { category: { $exists: true, $ne: null, $ne: '' } } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),

      // User signups per day last 7 days
      User.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo }, role: 'user' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Top 5 active users by number of receipts
      Receipt.aggregate([
        {
          $group: {
            _id: '$userId',
            receiptCount: { $sum: 1 },
            totalSpent: { $sum: '$totalAmount' },
          },
        },
        { $sort: { receiptCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userInfo',
          },
        },
        { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            receiptCount: 1,
            totalSpent: 1,
            fullName: '$userInfo.fullName',
          },
        },
      ]),

      // Recall alerts per day (last 7 days)
      FoodRecall.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Previous 7-day window for trend % calculation
      User.countDocuments({ role: 'user', createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } }),
      Receipt.countDocuments({ createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } }),
      FoodRecall.countDocuments({ createdAt: { $gte: fourteenDaysAgo, $lt: sevenDaysAgo } }),
    ]);

    // ── Build day-by-day maps for 7 days ──────────────────────────────────────
    function buildDayMap(raw, field = 'count') {
      const map = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        map[d.toISOString().split('T')[0]] = 0;
      }
      raw.forEach((r) => { if (r._id in map) map[r._id] = r[field] || 0; });
      return Object.entries(map).map(([date, value]) => ({ date, value }));
    }

    const receiptsChart = buildDayMap(receiptsPerDay);
    const userGrowthChart = buildDayMap(userGrowthRaw);
    const recallsChart = buildDayMap(recallsPerDay);

    // ── Product categories donut ───────────────────────────────────────────────
    const categoryColors = ['#16A34A', '#FACC15', '#60A5FA', '#A855F7', '#EC4899', '#CBD5E1'];
    const totalCategoryItems = productCategories.reduce((s, c) => s + c.count, 0) || 1;
    const categoryDonut = productCategories.map(({ _id, count }, i) => ({
      name: _id,
      count,
      pct: ((count / totalCategoryItems) * 100).toFixed(1),
      color: categoryColors[i % categoryColors.length],
    }));

    // ── Top users ─────────────────────────────────────────────────────────────
    const topUsers = topActiveUsersRaw.map((u) => ({
      name: u.fullName || 'Unknown',
      receiptCount: u.receiptCount,
      totalSpent: (u.totalSpent || 0).toFixed(0),
      initials: (u.fullName || 'U').split(' ').map((p) => p[0]).join('').toUpperCase(),
    }));

    // ── Trend % helpers ───────────────────────────────────────────────────────
    function trendPct(current, previous) {
      if (!previous) return current > 0 ? '+100%' : '0%';
      const pct = (((current - previous) / previous) * 100).toFixed(1);
      return (pct >= 0 ? '+' : '') + pct + '%';
    }

    const currentPeriodUsers = await User.countDocuments({ role: 'user', createdAt: { $gte: sevenDaysAgo } });
    const currentPeriodReceipts = await Receipt.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const currentPeriodRecalls = await FoodRecall.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    const totalAmountRaw = amountResult[0]?.total || 0;
    const formattedAmount = totalAmountRaw >= 10000000
      ? `₹${(totalAmountRaw / 10000000).toFixed(2)} Cr`
      : totalAmountRaw >= 100000
      ? `₹${(totalAmountRaw / 100000).toFixed(2)} L`
      : `₹${totalAmountRaw.toFixed(0)}`;

    // ── Reports summary table (one row per analytics category) ───────────────
    const reportsSummary = [
      {
        name: 'User Analytics Report',
        category: 'User Analytics',
        period: 'Last 7 Days',
        generatedOn: new Date().toLocaleString(),
        generatedBy: 'System',
        stats: { count: totalUsers, trend: trendPct(currentPeriodUsers, prevPeriodUsers) },
      },
      {
        name: 'Receipt Analytics Report',
        category: 'Receipt Analytics',
        period: 'Last 7 Days',
        generatedOn: new Date().toLocaleString(),
        generatedBy: 'System',
        stats: { count: totalReceipts, trend: trendPct(currentPeriodReceipts, prevPeriodReceipts) },
      },
      {
        name: 'Product Analytics Report',
        category: 'Product Analytics',
        period: 'All Time',
        generatedOn: new Date().toLocaleString(),
        generatedBy: 'System',
        stats: { count: totalProducts, trend: '+0%' },
      },
      {
        name: 'Food Recall Analytics Report',
        category: 'Food Recall Analytics',
        period: 'Last 7 Days',
        generatedOn: new Date().toLocaleString(),
        generatedBy: 'Admin',
        stats: { count: totalRecalls, trend: trendPct(currentPeriodRecalls, prevPeriodRecalls) },
      },
      {
        name: 'Amount Analysis Report',
        category: 'Financial Analytics',
        period: 'All Time',
        generatedOn: new Date().toLocaleString(),
        generatedBy: 'System',
        stats: { count: totalAmountRaw, trend: '+0%' },
      },
    ];

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalReceipts,
          totalProducts,
          totalRecalls,
          totalAmount: formattedAmount,
          userTrend: trendPct(currentPeriodUsers, prevPeriodUsers),
          receiptTrend: trendPct(currentPeriodReceipts, prevPeriodReceipts),
          recallTrend: trendPct(currentPeriodRecalls, prevPeriodRecalls),
        },
        receiptsChart,
        userGrowthChart,
        recallsChart,
        categoryDonut,
        topUsers,
        reportsSummary,
      },
    });
  } catch (error) {
    console.error('getReportsAnalytics error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



