import express from "express";
const router = express.Router();

import userRoutes from "./user.routes.js";
import chatRoutes from "./chat.routes.js";

router.use("/users", userRoutes);
router.use("/chats", chatRoutes);

export default router;
