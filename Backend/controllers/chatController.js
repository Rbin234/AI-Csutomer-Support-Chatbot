const Chat = require('../models/chat.model');
const { getAIResponse } = require('../services/openaiService');

// 1. Create a chat title
exports.createChatTitle = async (req, res) => {
  try {
    const { title } = req.body;
    const { id:userId } = req.user
    const existing = await Chat.findOne({ userId, title });
    if (existing)
      return res.status(400).json({ success: false, message: 'Title already exists for this user' });

    const chat = await Chat.create({ userId, title, messages: [] });
    res.status(201).json({ success: true, message: 'Chat created', chatId: chat._id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Add message to chat
exports.addMessageToChat = async (req, res) => {
  try {
    const { title, sender, message } = req.body;
    const { id:userId } = req.user
    const chat = await Chat.findOneAndUpdate(
      { userId, title },
      { $push: { messages: { sender, message } } },
      { new: true }
    );

    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    res.json({ success: true, message: 'Message added', chat });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 3. Get list of titles by userId
exports.getTitlesByUser = async (req, res) => {
  try {
    const { id : userId } = req.user

    const titles = await Chat.find({ userId }).select('title -_id');
    res.json({ success: true, titles: titles.map(c => c.title) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 4. Get conversation by userId and title
exports.getConversation = async (req, res) => {
  try {
    const { title } = req.params;
    const { id : userId } = req.user
    const chat = await Chat.findOne({ userId, title });
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    const sortedMessages = chat.messages.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    res.json({ success: true, title: chat.title, messages: sortedMessages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.chatWithAI = async (req, res) => {
  try {
    const { title, message } = req.body;
    const { id : userId } = req.user
    
    // 1. Save user's message
    const userMsg = { sender: 'user', message };
    const chat = await Chat.findOneAndUpdate(
      { userId, title },
      { $push: { messages: userMsg } },
      { new: true }
    );

    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    // 2. Get AI response
    const aiReply = await getAIResponse(message);

    // 3. Save AI's message
    const aiMsg = { sender: 'ai', message: aiReply };
    chat.messages.push(aiMsg);
    await chat.save();

    res.json({ success: true, userMessage: message, aiMessage: aiReply });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
