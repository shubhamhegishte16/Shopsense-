const ChatHistory = require('../models/ChatHistory');
const Receipt = require('../models/Receipt');
const PantryItem = require('../models/PantryItem');
const { sendChatMessage, buildSystemPrompt } = require('../utils/chatService');

// ─── POST /api/chat/message ───────────────────────────────────────────────────
exports.sendMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = req.user;
    const { message, chatId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    // 1. Fetch user context from MongoDB (runs in parallel for speed)
    const [receipts, pantryItems] = await Promise.all([
      Receipt.find({ userId }).sort({ createdAt: -1 }).limit(10).lean(),
      PantryItem.find({ userId }).sort({ createdAt: -1 }).limit(20).lean(),
    ]);

    // 2. Build the context-rich system prompt
    const systemPrompt = buildSystemPrompt(user, receipts, pantryItems);

    // 3. Find or create the chat session in MongoDB
    let chat;
    if (chatId) {
      chat = await ChatHistory.findOne({ _id: chatId, userId });
    }

    if (!chat) {
      // New chat — title is the first 60 chars of the first user message
      chat = new ChatHistory({
        userId,
        title: message.trim().substring(0, 60),
        messages: [],
      });
    }

    // 4. Add the new user message to history
    chat.messages.push({ role: 'user', content: message.trim() });
    chat.updatedAt = new Date();

    // 5. Pass conversation history to Gemini (last 20 messages for context)
    const historyForAI = chat.messages.slice(-20);
    const aiReplyText = await sendChatMessage(systemPrompt, historyForAI);

    // 6. Save AI reply to history
    chat.messages.push({ role: 'assistant', content: aiReplyText });
    await chat.save();

    res.json({
      success: true,
      chatId: chat._id,
      reply: aiReplyText,
    });

  } catch (error) {
    console.error('Chat Controller Error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to process chat message' });
  }
};

// ─── GET /api/chat/history ────────────────────────────────────────────────────
exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await ChatHistory.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(20)
      .select('_id title updatedAt') // Only return metadata, not all messages
      .lean();

    res.json({ success: true, chats });
  } catch (error) {
    console.error('Get Chat History Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

// ─── GET /api/chat/:id ────────────────────────────────────────────────────────
exports.getChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const chat = await ChatHistory.findOne({ _id: req.params.id, userId }).lean();

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json({ success: true, chat });
  } catch (error) {
    console.error('Get Chat Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
};

// ─── DELETE /api/chat/history ─────────────────────────────────────────────────
exports.clearHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    await ChatHistory.deleteMany({ userId });
    res.json({ success: true, message: 'All chats cleared' });
  } catch (error) {
    console.error('Clear History Error:', error.message);
    res.status(500).json({ error: 'Failed to clear chat history' });
  }
};
