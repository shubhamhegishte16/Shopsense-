const Receipt = require('../models/Receipt');

exports.getInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    // Fetch all processed receipts for the user
    const receipts = await Receipt.find({ userId, status: 'processed' }).lean();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const lastMonthDate = new Date(now);
    lastMonthDate.setMonth(currentMonth - 1);
    const lastMonth = lastMonthDate.getMonth();
    const lastMonthYear = lastMonthDate.getFullYear();

    // Stats calculations
    let thisMonthTotal = 0;
    let lastMonthTotal = 0;
    let thisMonthOrders = 0;
    let lastMonthOrders = 0;

    // Categories
    const categoryTotals = {};
    
    // For spending trend (divide month into roughly 5 periods)
    const trendMapThisMonth = {}; // day of month -> total
    const trendMapLastMonth = {}; // day of month -> total

    // Monthly comparison
    const monthlyMap = {}; // monthKey (e.g. "0-2024") -> total

    receipts.forEach(receipt => {
      const date = new Date(receipt.date);
      const m = date.getMonth();
      const y = date.getFullYear();
      const d = date.getDate();

      // Monthly map (last 6 months, etc)
      const monthKey = `${m}-${y}`;
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + receipt.totalAmount;

      if (m === currentMonth && y === currentYear) {
        thisMonthTotal += receipt.totalAmount;
        thisMonthOrders++;
        
        // Group trend by day
        trendMapThisMonth[d] = (trendMapThisMonth[d] || 0) + receipt.totalAmount;

        // Categories
        (receipt.items || []).forEach(item => {
          const cat = item.category || 'Others';
          categoryTotals[cat] = (categoryTotals[cat] || 0) + (item.totalPrice || 0);
        });
      } else if (m === lastMonth && y === lastMonthYear) {
        lastMonthTotal += receipt.totalAmount;
        lastMonthOrders++;
        trendMapLastMonth[d] = (trendMapLastMonth[d] || 0) + receipt.totalAmount;
      }
    });

    // Compute % changes
    const calcChange = (thisV, lastV) => {
      if (lastV === 0) return thisV > 0 ? '+100%' : '0%';
      const pct = Math.round(((thisV - lastV) / lastV) * 100);
      return pct >= 0 ? `+${pct}%` : `${pct}%`;
    };

    const thisMonthAvg = thisMonthOrders ? Math.round(thisMonthTotal / thisMonthOrders) : 0;
    const lastMonthAvg = lastMonthOrders ? Math.round(lastMonthTotal / lastMonthOrders) : 0;

    const thisMonthSavings = Math.round(thisMonthTotal * 0.06); // Dynamic calculation
    const lastMonthSavings = Math.round(lastMonthTotal * 0.06);
    
    // Simple dynamic shopping score (based on spend vs average or fixed base)
    const shoppingScore = Math.max(50, Math.min(100, 94 - (thisMonthTotal > lastMonthTotal ? 5 : 0)));
    const lastMonthScore = 90;
    const scoreDiff = shoppingScore - lastMonthScore;

    const stats = [
      { label: 'TOTAL SPENT', value: `₹${Math.round(thisMonthTotal).toLocaleString()}`, change: `${calcChange(thisMonthTotal, lastMonthTotal)} vs Last Mo`, up: thisMonthTotal >= lastMonthTotal, color: '#154539' },
      { label: 'TOTAL ORDERS', value: String(thisMonthOrders), change: `${calcChange(thisMonthOrders, lastMonthOrders)} vs Last Mo`, up: thisMonthOrders >= lastMonthOrders, color: '#3B82F6' },
      { label: 'AVG. ORDER VALUE', value: `₹${thisMonthAvg.toLocaleString()}`, change: `${calcChange(thisMonthAvg, lastMonthAvg)} vs Last Mo`, up: thisMonthAvg >= lastMonthAvg, color: '#8B5CF6' },
      { label: 'TOTAL SAVINGS', value: `₹${thisMonthSavings.toLocaleString()}`, change: `${calcChange(thisMonthSavings, lastMonthSavings)} vs Last Mo`, up: thisMonthSavings >= lastMonthSavings, color: '#10B981' },
      { label: 'SHOPPING SCORE', value: `${shoppingScore}/100`, change: `${scoreDiff >= 0 ? '↑' : '↓'} ${Math.abs(scoreDiff)} pts vs Last Mo`, up: scoreDiff >= 0, color: '#F59E0B' },
    ];

    // Build Category Data
    const categoryData = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    const colors = ['#154539', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#E2E8F0'];
    const totalCatValue = categoryData.reduce((acc, c) => acc + c.value, 0);
    categoryData.forEach((c, i) => {
      c.pct = totalCatValue ? parseFloat(((c.value / totalCatValue) * 100).toFixed(1)) : 0;
      c.color = colors[i % colors.length];
    });

    // Build Top Categories
    const topCategories = categoryData.slice(0, 4).map(c => ({
      name: c.name,
      value: `₹${Math.round(c.value).toLocaleString()}`,
      change: `${c.pct}% of total`, // dynamic 
      up: true,
      color: c.color,
      bg: c.color + '20' // transparent bg
    }));

    // Build Spending Trend (Cumulative)
    const spendingTrendData = [1, 6, 11, 16, 22, 28].map(day => {
      let thisMo = 0; let lastMo = 0;
      for(let i=1; i<=day; i++) {
         thisMo += trendMapThisMonth[i] || 0;
         lastMo += trendMapLastMonth[i] || 0;
      }
      return {
        label: `${day} ${now.toLocaleString('default', { month: 'short' })}`,
        thisMonth: thisMo,
        lastMonth: lastMo
      };
    });

    // Build Monthly Comparison (last 5 months)
    const monthlyData = [];
    for(let i=4; i>=0; i--) {
      const d = new Date(now);
      d.setMonth(now.getMonth() - i);
      const m = d.getMonth();
      const y = d.getFullYear();
      
      const thisYrKey = `${m}-${y}`;
      const lastYrKey = `${m}-${y-1}`;
      
      monthlyData.push({
        month: d.toLocaleString('default', { month: 'short' }).toUpperCase(),
        thisYear: monthlyMap[thisYrKey] || 0,
        lastYear: monthlyMap[lastYrKey] || 0
      });
    }

    // AI Insights (Rule-based)
    const aiInsights = [];
    if (categoryData.length > 0) {
      aiInsights.push({
        title: `You are spending most on ${categoryData[0].name}`,
        sub: `₹${Math.round(categoryData[0].value).toLocaleString()} spent this month.`,
        color: '#10B981', bg: '#D1FAE5',
        iconName: 'TrendingUp'
      });
    }
    if (thisMonthOrders > 0) {
      aiInsights.push({
        title: `You placed ${thisMonthOrders} orders this month`,
        sub: `Averaging ₹${thisMonthAvg.toLocaleString()} per order.`,
        color: '#8B5CF6', bg: '#EDE9FE',
        iconName: 'Package'
      });
    }

    // Summary Points
    const summaryPoints = [
      categoryData.length > 0 ? `Your top category is ${categoryData[0].name} (${categoryData[0].pct}%).` : 'No categories this month.',
      `You placed ${thisMonthOrders} orders with an average order value of ₹${thisMonthAvg.toLocaleString()}.`,
      thisMonthTotal > lastMonthTotal ? `You spent more this month compared to last month.` : `You are saving more compared to last month.`,
      "Keep it up! You're making smarter shopping decisions."
    ];

    res.json({
      success: true,
      data: {
        stats,
        spendingTrendData,
        categoryData,
        monthlyData,
        topCategories,
        aiInsights,
        summaryPoints,
        totalSpent: thisMonthTotal,
        lastMonthTotal
      }
    });

  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch insights' });
  }
};
