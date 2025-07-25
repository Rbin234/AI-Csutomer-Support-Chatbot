const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const verifyToken = require('../middleware/auth');

// Routes
router.post('/create', verifyToken, chatController.createChatTitle);
router.post('/add-message', verifyToken, chatController.addMessageToChat);
router.get('/titles', verifyToken, chatController.getTitlesByUser);
router.get('/conversation/:title', verifyToken, chatController.getConversation);
router.post('/', verifyToken, chatController.chatWithAI);

module.exports = router;
