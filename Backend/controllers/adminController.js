const mongoose = require('mongoose');
const User = require('../models/User');
const Receipt = require('../models/Receipt');
const Notification = require('../models/Notification');
const AdminNotification = require('../models/AdminNotification');

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

const Product = require('../models/Product'); // I need to make sure this is required at the top

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

const CommunityMessage = require('../models/CommunityMessage');
const IssueReport = require('../models/IssueReport');
const FoodRecall = require('../models/FoodRecall');

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

