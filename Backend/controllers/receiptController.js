const Receipt = require('../models/Receipt');
const Product = require('../models/Product');
const PantryItem = require('../models/PantryItem');
const { extractReceiptData } = require('../utils/geminiService');
const { uploadToCloudinary } = require('../config/cloudinary');

exports.uploadReceipt = async (req, res) => {
  try {
    // 1. Image is buffered in memory by Multer middleware
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log(`Processing receipt: ${req.file.originalname} (${req.file.mimetype}, ${req.file.size} bytes)`);

    // req.user is guaranteed to exist — injected by protect middleware
    const userId = req.user._id;

    // 2. Pass buffer to Gemini for OCR & Categorization, and upload to Cloudinary simultaneously
    const [extractedData, imageUrl] = await Promise.all([
      extractReceiptData(req.file.buffer, req.file.mimetype),
      uploadToCloudinary(req.file.buffer, req.file.mimetype)
    ]);

    console.log("Extracted Data:", JSON.stringify(extractedData, null, 2));
    console.log("Cloudinary URL:", imageUrl);

    // 3. Validation Engine
    const calculatedTotal = (extractedData.subtotal || 0) + (extractedData.taxes || 0) - (extractedData.discounts || 0);
    const isValid = Math.abs(calculatedTotal - (extractedData.totalAmount || 0)) < 0.05;
    const validationStatus = isValid ? 'valid' : 'mismatch';

    // 4. Save to MongoDB - Receipts
    const newReceipt = new Receipt({
      userId,
      imageUrl,
      storeName: extractedData.storeName,
      date: extractedData.date ? new Date(extractedData.date) : new Date(),
      items: extractedData.items || [],
      subtotal: extractedData.subtotal || 0,
      taxes: extractedData.taxes || 0,
      discounts: extractedData.discounts || 0,
      totalAmount: extractedData.totalAmount || 0,
      status: 'processed',
      validationStatus,
      aiExtraction: {
        raw: extractedData,
        summary: `Extracted ${extractedData.items?.length || 0} items from ${extractedData.storeName || 'receipt'}.`,
      },
      activity: [
        { label: 'Uploaded', description: 'Receipt uploaded by user.' },
        { label: 'AI Extraction', description: 'Receipt data extracted by Gemini.' },
        { label: 'Validation', description: validationStatus === 'valid' ? 'Receipt totals matched extracted values.' : 'Receipt totals need review.' },
      ]
    });
    const savedReceipt = await newReceipt.save();
    console.log("Receipt saved to MongoDB:", savedReceipt._id);

    // 5. Process Products and Pantry — per-item error isolation
    const items = extractedData.items || [];
    for (const item of items) {
      try {
        // Skip items with no name (Gemini may return null for unreadable lines)
        if (!item.name || typeof item.name !== 'string') {
          console.warn('Skipping item with null/empty name:', item);
          continue;
        }

        const normalized = item.name.toLowerCase().trim();
        let product = await Product.findOne({ normalizedName: normalized });
        if (!product) {
          product = await Product.create({
            name: item.name,
            normalizedName: normalized,
            category: item.category || 'Other',
            brand: item.brand || null
          });
        }
        await PantryItem.create({
          userId,
          productId: product._id,
          name: item.name,
          quantity: item.quantity || 1,
          category: item.category || 'Other',
          addedFromReceiptId: savedReceipt._id
        });
      } catch (itemErr) {
        // Log but don't fail the entire request for a single bad item
        console.error(`Failed to process pantry item "${item.name}":`, itemErr.message);
      }
    }

    res.status(201).json({
      message: 'Receipt processed successfully',
      receipt: savedReceipt
    });

  } catch (error) {
    console.error("=== Receipt Upload Error ===");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    res.status(500).json({ error: error.message || 'Failed to process receipt' });
  }
};

exports.getReceipts = async (req, res) => {
  try {
    // Scope to the authenticated user only
    const userId = req.user._id;
    const receipts = await Receipt.find({ userId }).sort({ createdAt: -1 }).limit(50);
    res.json({ receipts });
  } catch (error) {
    console.error("Get Receipts Error:", error.message);
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
};

exports.deleteReceipt = async (req, res) => {
  try {
    const userId = req.user._id;
    const receiptId = req.params.id;

    // Verify receipt belongs to user
    const receipt = await Receipt.findOne({ _id: receiptId, userId });
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    // Find associated pantry items
    const pantryItems = await PantryItem.find({ addedFromReceiptId: receiptId, userId });
    const productIds = pantryItems.map(item => item.productId).filter(id => id);

    // Delete associated pantry items
    await PantryItem.deleteMany({ addedFromReceiptId: receiptId, userId });

    // Delete associated products as requested
    if (productIds.length > 0) {
      await Product.deleteMany({ _id: { $in: productIds } });
    }

    // Delete the receipt
    await Receipt.deleteOne({ _id: receiptId });

    res.json({ message: 'Receipt and associated items deleted successfully' });
  } catch (error) {
    console.error("Delete Receipt Error:", error.message);
    res.status(500).json({ error: 'Failed to delete receipt' });
  }
};
