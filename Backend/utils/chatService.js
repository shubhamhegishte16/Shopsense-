const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

// ─── Dedicated AI client using GEMINI_CHAT_API_KEY ────────────────────────────
// This is intentionally separate from geminiService.js (receipt scanner)
// so that chat traffic never consumes the receipt scanner's quota.
const chatAI = new GoogleGenAI({ apiKey: process.env.GEMINI_CHAT_API_KEY });

/**
 * Builds a rich system prompt by injecting the user's real database context.
 * This makes Gemini "smart" about this specific user without any model training.
 */
function buildSystemPrompt(user, receipts = [], pantryItems = []) {
  const userName = user?.name || 'there';

  // Summarize pantry items
  const pantryContext = pantryItems.length > 0
    ? pantryItems
        .slice(0, 20) // cap to avoid token bloat
        .map(item => `- ${item.name} | Status: ${item.status} | Qty: ${item.quantity} ${item.unit || 'unit'}`)
        .join('\n')
    : '- No pantry items found yet.';

  // Summarize recent receipts
  const receiptContext = receipts.length > 0
    ? receipts
        .slice(0, 10)
        .map(r => {
          const itemNames = (r.items || []).slice(0, 5).map(i => i.name).join(', ');
          return `- ${r.storeName || 'Unknown Store'} on ${r.date ? new Date(r.date).toLocaleDateString('en-IN') : 'Unknown Date'} | Total: ₹${r.totalAmount || 0} | Items: ${itemNames || 'N/A'}`;
        })
        .join('\n')
    : '- No receipts uploaded yet.';

  // Calculate a quick spend summary for the AI
  const totalSpend = receipts.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
  const categorySpend = {};
  receipts.forEach(r => {
    (r.items || []).forEach(item => {
      const cat = item.category || 'Other';
      categorySpend[cat] = (categorySpend[cat] || 0) + (item.totalPrice || 0);
    });
  });
  const topCategories = Object.entries(categorySpend)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat, amt]) => `${cat}: ₹${amt.toFixed(0)}`)
    .join(', ');

  return `You are ShopSense AI — a friendly, intelligent personal shopping assistant.
You help users track their grocery spending, manage their pantry, and save money.

USER PROFILE:
- Name: ${userName}
- Total spend across all receipts: ₹${totalSpend.toFixed(0)}
- Top spending categories: ${topCategories || 'Not enough data yet'}

USER'S CURRENT PANTRY (live inventory from their scanned receipts):
${pantryContext}

USER'S RECENT RECEIPTS (last 10 purchases):
${receiptContext}

INSTRUCTIONS:
1. Always address the user by their first name (${userName}).
2. Use the pantry and receipt data above to give PERSONALIZED, DATA-DRIVEN answers.
3. When asked about spending, reference actual amounts from the receipts above.
4. When asked about pantry/stock, reference actual items from the pantry above.
5. Be concise, friendly, and actionable.
6. If data is missing (no receipts/pantry), encourage the user to upload a receipt.
7. Format responses cleanly — use line breaks and bullet points when listing items.
8. Never make up numbers or items that are not in the data above.
9. Keep responses under 200 words unless the user asks for a detailed breakdown.`;
}

/**
 * Sends a conversation to Gemini and returns the AI's reply text.
 * @param {string} systemPrompt - The context-rich system prompt
 * @param {Array} conversationHistory - [{role: 'user'|'assistant', content: string}]
 * @returns {Promise<string>} The AI reply text
 */
async function sendChatMessage(systemPrompt, conversationHistory = []) {
  try {
    // Build the contents array — system prompt + full conversation history
    const contents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt + '\n\nPlease acknowledge you are ready to help.' }],
      },
      {
        role: 'model',
        parts: [{ text: `Understood! I'm ready to help with personalized shopping insights.` }],
      },
      // Inject the actual conversation history
      ...conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
    ];

    const response = await chatAI.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents,
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from Gemini Chat');
    return text.trim();

  } catch (error) {
    console.error('Chat AI Error:', error?.message || error);

    if (error?.status === 429 || error?.message?.includes('429')) {
      throw new Error('Chat API quota exceeded. Please wait a moment and try again.');
    }
    if (error?.status === 403 || error?.message?.includes('API_KEY')) {
      throw new Error('Chat API key is invalid. Please check GEMINI_CHAT_API_KEY in your .env file.');
    }
    throw new Error('Failed to get a response from the AI. Please try again.');
  }
}

module.exports = { sendChatMessage, buildSystemPrompt };
