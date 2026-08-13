const Receipt = require('../models/Receipt');
const ShoppingTrip = require('../models/ShoppingTrip');
const PantryItem = require('../models/PantryItem');
const User = require('../models/User');

// @desc    Get dashboard summary data
// @route   GET /api/dashboard
// @access  Private
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    
    // 1. Hero Stats (Total Savings this month) & AI Savings (5% of total spent)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const tripsThisMonth = await ShoppingTrip.find({ 
      userId, 
      date: { $gte: startOfMonth } 
    });
    
    let totalSavingsThisMonth = 0;
    let totalSpentThisMonth = 0;
    tripsThisMonth.forEach(trip => {
      totalSavingsThisMonth += (trip.totalSavings || 0);
      totalSpentThisMonth += (trip.totalSpent || 0);
    });

    const heroStats = {
      totalSaved: totalSavingsThisMonth,
      betterDeals: 0, // Could be dynamic if we track individual deal counts
      increases: 0,
      recallAlert: 0 // Could link to a notification system
    };

    // AI Savings = 5% of total spent this month (heuristic)
    const aiSavings = {
      potentialSavings: Math.round(totalSpentThisMonth * 0.05)
    };

    // 2. Shopping DNA
    // Score based on savings ratio. Max 100.
    let score = 50; 
    let persona = 'Casual Shopper';
    if (totalSpentThisMonth > 0) {
      const savingsRatio = totalSavingsThisMonth / totalSpentThisMonth;
      score = Math.min(100, Math.round(50 + (savingsRatio * 200))); // e.g. 10% savings = score 70
      if (score >= 80) persona = 'Bargain Hunter';
      else if (score >= 60) persona = 'Budget Conscious';
    }
    const shoppingDNA = {
      score,
      persona,
      pointsChange: 0 // Could compare to last month's score
    };

    // Fetch Receipts for Price Radar, Spending Chart, and Recent Activity
    const allReceipts = await Receipt.find({ userId }).sort({ date: -1 }).lean();

    // 3. Price Radar
    const itemPrices = {};
    const priceRadarMap = {};
    
    allReceipts.forEach(receipt => {
      if (receipt.items && Array.isArray(receipt.items)) {
        receipt.items.forEach(item => {
          if (!item.name) return;
          const name = item.name.trim().toLowerCase();
          const price = item.unitPrice || (item.totalPrice / (item.quantity || 1));
          if (price == null || isNaN(price)) return;
          
          if (!itemPrices[name]) {
            itemPrices[name] = price;
          } else {
            if (!priceRadarMap[name]) {
              const latestPrice = itemPrices[name];
              const oldPrice = price;
              let up = null;
              if (latestPrice > oldPrice) up = true;
              else if (latestPrice < oldPrice) up = false;
              
              priceRadarMap[name] = {
                name: item.name, // Keep original case
                price: `₹${latestPrice.toFixed(0)}`,
                up
              };
            }
          }
        });
      }
    });
    
    const priceRadar = Object.values(priceRadarMap).slice(0, 4); // Take top 4

    // 4. Spending Chart (Group receipts by week for the last 30 days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentReceipts = allReceipts.filter(r => new Date(r.date) >= thirtyDaysAgo);
    
    // Group by simple weekly buckets (e.g. Week 1, Week 2, or specific dates)
    // To make it simple and match the UI, we'll sort them and take 5 points
    // Let's just group by day and take the last 5 active days.
    const spendingMap = {};
    recentReceipts.forEach(r => {
      const day = new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      spendingMap[day] = (spendingMap[day] || 0) + r.totalAmount;
    });
    
    let spendingChart = Object.keys(spendingMap).map(day => ({
      name: day,
      value: spendingMap[day]
    })).reverse(); // chronological

    // If not enough data points, we just send what we have.
    if (spendingChart.length > 5) {
      spendingChart = spendingChart.slice(spendingChart.length - 5);
    }

    // 5. Recent Activity (Mix of ShoppingTrips and Receipts)
    let activities = [];
    
    const recentTrips = await ShoppingTrip.find({ userId }).sort({ date: -1 }).limit(3).populate('receiptIds').lean();
    recentTrips.forEach(trip => {
      const storeName = trip.storeName || (trip.receiptIds && trip.receiptIds.length > 0 ? trip.receiptIds[0].storeName : 'Unknown Store');
      activities.push({
        type: 'trip',
        date: new Date(trip.date),
        name: storeName,
        time: new Date(trip.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ` • ₹${trip.totalSpent}`,
        saved: trip.totalSavings > 0 ? `Saved ₹${trip.totalSavings}` : 'Trip Logged',
        color: '#154539'
      });
    });

    const recentUploads = allReceipts.slice(0, 3);
    recentUploads.forEach(receipt => {
      activities.push({
        type: 'receipt',
        date: new Date(receipt.createdAt || receipt.date),
        name: receipt.storeName || 'Uploaded Receipt',
        time: new Date(receipt.createdAt || receipt.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ` • ₹${receipt.totalAmount}`,
        saved: 'Receipt Uploaded',
        color: '#F59E0B'
      });
    });

    activities.sort((a, b) => b.date - a.date);
    const recentActivity = activities.slice(0, 4).map(({ type, date, ...rest }) => rest);

    // 6. Pantry Essentials (Items expiring soon)
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const expiringPantryItems = await PantryItem.find({
      userId,
      estimatedExpiryDate: { $gte: now, $lte: sevenDaysFromNow },
      status: { $in: ['available', 'low_stock'] }
    }).limit(4);

    let pantryEssentials = expiringPantryItems.map(item => {
      const diffTime = Math.abs(new Date(item.estimatedExpiryDate) - now);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        name: item.name,
        icon: '🥛', // Mock icon
        left: `${diffDays} DAYS LEFT`,
        color: diffDays <= 3 ? '#EF4444' : '#F59E0B',
        bg: diffDays <= 3 ? '#FEE2E2' : '#FEF3C7'
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
