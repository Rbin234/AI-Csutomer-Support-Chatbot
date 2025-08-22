import express from "express";
const router = express.Router();

import * as chatController from "../controllers/chatController.js";
import verifyToken from "../middleware/auth.js";

// Routes
router.post("/create", verifyToken, chatController.createChatTitle);
router.post("/add-message", verifyToken, chatController.addMessageToChat);
router.get("/titles", verifyToken, chatController.getTitlesByUser);
router.get("/conversation/:title", verifyToken, chatController.getConversation);
router.post("/", verifyToken, chatController.chatWithAI);

export default router;
