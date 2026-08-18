const { GoogleGenAI } = require('@google/genai');
const google = require('googlethis');
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

Please USE GOOGLE SEARCH to find the most accurate, realistic, and up-to-date pricing and details for this exact product across the following stores: ${targetStores}.
If a store doesn't sell it, you can omit it, but try to provide at least 3-4 store options.

Also, use Google Search to find a high-quality product image URL (must end in .jpg, .png, etc or be a valid image link) for this specific product.`;

    const COMPARE_SCHEMA = {
      type: 'object',
      properties: {
        imageUrl: {
          type: 'string',
          description: 'A valid, high-quality image URL for the product found via search',
        },
        comparisons: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              store: { type: 'string' },
              price: { type: 'number', description: 'Current selling price in INR' },
              mrp: { type: 'number', description: 'Original MRP in INR' },
              discount: { type: 'string', description: 'Discount percentage or text, e.g. "15%"' },
              deliveryTime: { type: 'string', description: 'e.g. "Tomorrow" or "10 mins"' },
              rating: { type: 'number' },
              link: { type: 'string', description: 'Valid product link URL' },
            },
            required: ['store', 'price', 'mrp', 'discount', 'deliveryTime', 'rating', 'link']
          }
        }
      },
      required: ['imageUrl', 'comparisons']
    };

    let response;
    try {
      // First attempt: High accuracy using Google Search Grounding
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: prompt,
        config: {
          temperature: 0.2, // Low temperature for more factual responses
          tools: [{ googleSearch: {} }],
          responseMimeType: 'application/json',
          responseSchema: COMPARE_SCHEMA,
        }
      });
    } catch (searchError) {
      console.warn("Google Search Grounding failed (likely 429 Quota Exceeded). Falling back to custom web scrape.", searchError?.message || searchError);
      
      let liveContext = "";
      try {
        const query = `${productName} ${brand || ''} price in India ${targetStores.split(',')[0]}`.trim();
        const searchResults = await google.search(query, {
          page: 0, 
          safe: false, 
          additional_params: { hl: 'en', gl: 'in' } 
        });
        
        // Take top 5 results for context
        const snippets = searchResults.results.slice(0, 5).map(res => `Title: ${res.title}\nSnippet: ${res.description}`).join('\n\n');
        liveContext = `\n\n=== LIVE INTERNET SEARCH RESULTS FOR CONTEXT ===\n${snippets}\n================================================\n\nPlease strictly use the real-time prices found in the search results above. Do not guess low prices like 32 INR for milk, use the actual market prices (e.g. 50-60+ INR) found in the search snippets or standard for India.`;
        
        // Try to grab an image URL from google images
        const imageQuery = `${productName} ${brand || ''} product`.trim();
        const imageResults = await google.image(imageQuery, { safe: false });
        if (imageResults && imageResults.length > 0) {
           liveContext += `\n\nPossible image URL to use: ${imageResults[0].url}`;
        }
      } catch (scrapeErr) {
        console.error("Custom web scrape failed:", scrapeErr);
      }

      // Fallback attempt: Standard generation with our custom scraped context
      const fallbackPrompt = prompt.replace(/USE GOOGLE SEARCH to find/g, 'provide').replace(/use Google Search to find/g, 'provide') + liveContext;
      
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: fallbackPrompt,
        config: {
          temperature: 0.2,
          responseMimeType: 'application/json',
          responseSchema: COMPARE_SCHEMA,
        }
      });
    }

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Gemini returned an empty response');
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error('Gemini comparison error:', error);
    throw new Error('Failed to generate product comparison with AI');
  }
}

module.exports = {
  extractReceiptData,
  compareProducts
};