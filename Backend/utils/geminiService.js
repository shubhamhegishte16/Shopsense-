const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const RECEIPT_SCHEMA = {
  type: 'object',
  properties: {
    storeName: {
      type: 'string',
      nullable: true,
    },
    date: {
      type: 'string',
      nullable: true,
    },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          quantity: {
            type: 'number',
          },
          unitPrice: {
            type: 'number',
          },
          totalPrice: {
            type: 'number',
          },
          category: {
            type: 'string',
          },
          brand: {
            type: 'string',
            nullable: true,
          },
        },
        required: [
          'name',
          'quantity',
          'unitPrice',
          'totalPrice',
          'category',
          'brand',
        ],
      },
    },
    subtotal: {
      type: 'number',
    },
    taxes: {
      type: 'number',
    },
    discounts: {
      type: 'number',
    },
    totalAmount: {
      type: 'number',
    },
  },
  required: [
    'storeName',
    'date',
    'items',
    'subtotal',
    'taxes',
    'discounts',
    'totalAmount',
  ],
};

const RECEIPT_PROMPT = `
You are an expert shopping receipt OCR and data extraction system.

Analyze the provided receipt image carefully and extract the information into the required JSON structure.

Rules:

1. Extract every identifiable purchased item.
2. Normalize product names and fix obvious abbreviations.
   Example:
   "AASHIRVAAD W ATTA 5KG"
   should become
   "Aashirvaad Whole Wheat Atta 5kg".

3. Extract quantity, unit price and total price whenever visible.
4. Determine the most appropriate product category:
   - Groceries
   - Electronics
   - Household
   - Personal Care
   - Clothing
   - Pharmacy
   - Other

5. Extract the brand when it can be reliably identified.
6. If the brand cannot be identified, return null.
7. If a string field cannot be determined, return null.
8. If a numeric field cannot be determined, return 0.
9. Convert the receipt date to YYYY-MM-DD when possible.
10. Do not invent information that is not visible on the receipt.
11. Carefully distinguish subtotal, tax, discount and final total.
12. Read the receipt from top to bottom and check the entire image before responding.
`;

async function extractReceiptData(buffer, mimeType) {
  try {
    if (!buffer || !Buffer.isBuffer(buffer)) {
      throw new Error('Invalid receipt buffer');
    }

    if (!mimeType) {
      throw new Error('Receipt MIME type is missing');
    }

    console.log('Sending receipt to Gemini...');

    const base64Data = buffer.toString('base64');

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',

      contents: [
        {
          parts: [
            {
              text: RECEIPT_PROMPT,
            },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ],

      config: {
        responseMimeType: 'application/json',
        responseSchema: RECEIPT_SCHEMA,
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error('Gemini returned an empty response');
    }

    console.log('Gemini extraction successful');

    let receiptData;

    try {
      receiptData = JSON.parse(text);
    } catch (parseError) {
      console.error('Gemini returned invalid JSON:', text);
      throw new Error('Gemini returned invalid JSON');
    }

    return receiptData;

  } catch (error) {
    console.error(
      'Gemini Extraction Error:',
      error?.message || error
    );

    if (error?.status === 429 || error?.code === 429) {
      throw new Error(
        'Gemini API quota exceeded. Please try again later.'
      );
    }

    if (error?.status === 404 || error?.code === 404) {
      throw new Error(
        'Gemini model is unavailable for this API project.'
      );
    }

    throw new Error('Failed to process receipt with AI');
  }
}

/**
 * Uses Gemini to search for real-time comparison data of a product across various stores.
 */
async function compareProducts({ productName, brand, category, description }) {
  try {
    const isGeneralEcom = ['electronics', 'furniture', 'clothing', 'household', 'appliances', 'general'].includes((category || '').toLowerCase());
    
    // Choose the target stores based on category
    const targetStores = isGeneralEcom 
      ? "Amazon, Flipkart, Croma, Reliance Digital, Myntra" 
      : "Blinkit, Zepto, Swiggy Instamart, BigBasket, Amazon Fresh";

    const prompt = `You are a real-time smart shopping assistant. The user wants to compare the following product across multiple Indian online stores. 

Product Name: ${productName}
Brand: ${brand || 'Any'}
Category: ${category || 'Unknown'}
Additional Details: ${description || 'None'}

Please provide realistic, up-to-date pricing and details for this exact product across the following stores: ${targetStores}. 
If a store doesn't sell it, you can omit it, but try to provide at least 3-4 store options.

Return the result as a strict JSON array of objects. 
Each object must match this schema:
{
  "store": "Store Name",
  "price": 1299, // Current selling price in INR as a number
  "mrp": 1599, // Original MRP in INR as a number
  "discount": "15%", // String format
  "deliveryTime": "Tomorrow" or "10 mins",
  "rating": 4.5, // Number
  "link": "https://example.com/product-link"
}

Do not include markdown blocks, just return the raw JSON array. Make sure the JSON is valid.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: prompt,
      config: {
        temperature: 0.2, // Low temperature for more factual responses
      }
    });

    const responseText = response.text || '';
    
    // Clean up response if Gemini wrapped it in markdown code block
    const cleanedText = responseText.replace(/```json\n?|\n?```/gi, '').trim();
    
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Gemini comparison error:', error);
    throw new Error('Failed to generate product comparison with AI');
  }
}

module.exports = {
  extractReceiptData,
  compareProducts
};