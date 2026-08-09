const PantryItem = require('../models/PantryItem');

exports.getPantryItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const items = await PantryItem.find({ userId })
      .populate('productId') 
      .sort({ createdAt: -1 });
      
    res.json({ success: true, items });
  } catch (error) {
    console.error("Get Pantry Items Error:", error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch pantry items' });
  }
};
