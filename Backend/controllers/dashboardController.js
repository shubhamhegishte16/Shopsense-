const Receipt = require('../models/Receipt');
const PantryItem = require('../models/PantryItem');
const Notification = require('../models/Notification');

// @desc    Get dashboard summary data
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // ─── Date Boundaries ─────────────────────────────────────────────────
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // ─── Fetch Receipts ───────────────────────────────────────────────────
    const allReceipts = await Receipt.find({ userId }).sort({ date: -1 }).lean();
    const thisMonthReceipts = allReceipts.filter(r => new Date(r.date) >= startOfThisMonth);
    const lastMonthReceipts = allReceipts.filter(r => {
      const d = new Date(r.date);
      return d >= startOfLastMonth && d <= endOfLastMonth;
    });

    // ─── Helper: Period Stats ─────────────────────────────────────────────
    function periodStats(receipts) {
      const totalSpent  = receipts.reduce((s, r) => s + (r.totalAmount || 0), 0);
      const totalSaved  = receipts.reduce((s, r) => s + (r.discounts   || 0), 0);
      const betterDeals = receipts.filter(r => (r.discounts || 0) > 0).length;
      return { totalSpent, totalSaved, betterDeals };
    }

    const thisMonth = periodStats(thisMonthReceipts);
    const lastMonth = periodStats(lastMonthReceipts);

    // ─── 1. Price Radar (needs to run before heroStats for `increases`) ───
    const itemPrices   = {};
    const priceRadarMap = {};

    allReceipts.forEach(receipt => {
      if (!receipt.items || !Array.isArray(receipt.items)) return;
      receipt.items.forEach(item => {
        if (!item.name) return;
        const name  = item.name.trim().toLowerCase();
        const price = item.unitPrice != null
          ? item.unitPrice
          : item.totalPrice != null
            ? item.totalPrice / (item.quantity || 1)
            : null;
        if (price == null || isNaN(price)) return;

        if (!itemPrices[name]) {
          itemPrices[name] = price;
        } else if (!priceRadarMap[name]) {
          const latestPrice = itemPrices[name];
          const oldPrice    = price;
          const up = latestPrice > oldPrice ? true : latestPrice < oldPrice ? false : null;
          if (up !== null) {
            priceRadarMap[name] = {
              name:  item.name,
              price: `₹${latestPrice.toFixed(0)}`,
              up
            };
          }
        }
      });
    });

    const priceRadar = Object.values(priceRadarMap).slice(0, 4);

    // ─── 2. Hero Stats ────────────────────────────────────────────────────
    const recallAlert = await Notification.countDocuments({ userId, type: 'recall', read: false });

    const heroStats = {
      totalSaved:   Math.round(thisMonth.totalSaved),
      betterDeals:  thisMonth.betterDeals,
      increases:    priceRadar.filter(i => i.up).length,
      recallAlert
    };

    // ─── 3. Shopping DNA ──────────────────────────────────────────────────
    function dnaScore(spent, saved) {
      if (spent <= 0) return 50;
      return Math.min(100, Math.round(50 + (saved / spent) * 200));
    }

    const thisScore = dnaScore(thisMonth.totalSpent, thisMonth.totalSaved);
    const lastScore = dnaScore(lastMonth.totalSpent, lastMonth.totalSaved);

    let persona = 'Casual Shopper';
    if (thisScore >= 80) persona = 'Bargain Hunter';
    else if (thisScore >= 65) persona = 'Budget Conscious';
    else if (thisScore >= 55) persona = 'Smart Buyer';

    const shoppingDNA = {
      score:        thisScore,
      persona,
      pointsChange: thisScore - lastScore
    };

    // ─── 4. AI Savings ────────────────────────────────────────────────────
    const aiSavings = {
      potentialSavings: Math.round(thisMonth.totalSpent * 0.05)
    };

    // ─── 5. Spending Chart (this month + last month) ──────────────────────
    function buildChart(receipts) {
      const map = {};
      receipts.forEach(r => {
        const day = new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        map[day] = (map[day] || 0) + (r.totalAmount || 0);
      });
      // Return in chronological order
      return Object.entries(map)
        .map(([name, value]) => ({ name, value: Math.round(value) }))
        .reverse();
    }

    const spendingChart = {
      thisMonth:      buildChart(thisMonthReceipts),
      lastMonth:      buildChart(lastMonthReceipts),
      thisMonthTotal: Math.round(thisMonth.totalSpent),
      lastMonthTotal: Math.round(lastMonth.totalSpent)
    };

    // ─── 6. Recent Activity (from receipts) ──────────────────────────────
    const recentActivity = allReceipts.slice(0, 5).map(r => ({
      name:  r.storeName || 'Unknown Store',
      time:  new Date(r.createdAt || r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
             + ` • ₹${r.totalAmount}`,
      saved: (r.discounts || 0) > 0 ? `Saved ₹${r.discounts}` : 'Receipt Uploaded',
      color: '#154539'
    }));

    // ─── 7. Pantry Essentials ─────────────────────────────────────────────
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expiringItems = await PantryItem.find({
      userId,
      estimatedExpiryDate: { $gte: now, $lte: sevenDaysFromNow },
      status: { $in: ['available', 'low_stock'] }
    }).limit(4).lean();

    const pantryEssentials = expiringItems.map(item => {
      const diffDays = Math.ceil((new Date(item.estimatedExpiryDate) - now) / 86400000);
      return {
        name:  item.name,
        icon:  '🥛',
        left:  `${diffDays} DAYS LEFT`,
        color: diffDays <= 3 ? '#EF4444' : '#F59E0B',
        bg:    diffDays <= 3 ? '#FEE2E2' : '#FEF3C7'
      };
    });

    res.json({
      success: true,
      data: {
        heroStats,
        shoppingDNA,
        aiSavings,
        recentActivity,
        spendingChart,
        pantryEssentials,
        priceRadar
      }
    });

  } catch (error) {
    console.error('Dashboard Data Fetch Error:', error);
    res.status(500).json({ success: false, message: 'Server Error: Failed to fetch dashboard data' });
  }
};
