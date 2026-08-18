const { compareProducts } = require('../utils/geminiService');
const Notification = require('../models/Notification');

// Maps store names to consistent UI properties
const STORE_UI_CONFIG = {
  'amazon': { bg: '#FF9900', initial: 'A' },
  'flipkart': { bg: '#2874F0', initial: 'F' },
  'croma': { bg: '#00E676', initial: 'C' },
  'reliance digital': { bg: '#E53935', initial: 'R' },
  'myntra': { bg: '#EC4899', initial: 'M' },
  'blinkit': { bg: '#EAB308', initial: 'B' },
  'zepto': { bg: '#8B5CF6', initial: 'Z' },
  'swiggy instamart': { bg: '#F97316', initial: 'I' },
  'bigbasket': { bg: '#16A34A', initial: 'bb' },
  'amazon fresh': { bg: '#059669', initial: 'a' }
};

const getStoreUIConfig = (storeName) => {
  const normalized = storeName.toLowerCase().trim();
  // Find a matching key in config, or fallback to default
  const match = Object.keys(STORE_UI_CONFIG).find(key => normalized.includes(key));
  
  if (match) {
    return STORE_UI_CONFIG[match];
  }
  
  // Default config if not found
  return { 
    bg: '#64748B', 
    initial: storeName.charAt(0).toUpperCase() || 'S' 
  };
};

exports.searchStores = async (req, res) => {
  try {
    const { productName, brand, category, description } = req.body;

    if (!productName) {
      return res.status(400).json({ success: false, message: 'Product name is required' });
    }

    // Call Gemini to get real-time store comparisons and product image
    const rawResult = await compareProducts({ productName, brand, category, description });
    const rawComparisons = rawResult?.comparisons || [];
    const productImageUrl = rawResult?.imageUrl || '';

    if (!rawComparisons || !Array.isArray(rawComparisons) || rawComparisons.length === 0) {
      return res.json({ success: true, product: { name: productName, img: productImageUrl, comparisons: [] } });
    }

    // Process and enrich the raw data from Gemini
    const enrichedComparisons = rawComparisons.map((item, index) => {
      const uiConfig = getStoreUIConfig(item.store);
      
      return {
        store: item.store,
        storeBg: uiConfig.bg,
        storeInitial: uiConfig.initial,
        price: `₹${item.price.toLocaleString('en-IN')}`,
        rawPrice: item.price,
        mrp: `₹${item.mrp.toLocaleString('en-IN')}`,
        discount: item.discount || '0%',
        delivery: item.deliveryTime || 'Standard',
        rating: typeof item.rating === 'number' ? item.rating.toFixed(1) : item.rating,
        link: item.link || '#'
      };
    });

    // Sort by cheapest price
    enrichedComparisons.sort((a, b) => a.rawPrice - b.rawPrice);

    // Mark the best value (cheapest)
    if (enrichedComparisons.length > 0) {
      enrichedComparisons[0].isBest = true;
      enrichedComparisons[0].value = 'Best Value';
      enrichedComparisons[0].valueBg = '#154539';
      enrichedComparisons[0].valueColor = '#FFFFFF';
    }

    // Compile final product object
    const finalProduct = {
      name: productName,
      brand: brand || '',
      category: category || '',
      desc: description || '',
      img: productImageUrl || 'https://images.unsplash.com/photo-1585664811087-47f65abbad64?auto=format&fit=crop&w=400&h=300&q=80',
      comparisons: enrichedComparisons
    };

    // Notification for comparison
    if (req.user && req.user._id) {
      await Notification.create({
        userId: req.user._id,
        title: 'Price Comparison Generated',
        message: `Successfully compared prices for ${productName}. Best value found at ${enrichedComparisons[0]?.store || 'multiple stores'}.`,
        type: 'compare'
      });
    }

    res.json({ success: true, product: finalProduct });

  } catch (error) {
    console.error('Store search error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate store comparisons' });
  }
};
