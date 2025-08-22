import express from "express";
const router = express.Router();

import * as userController from "../controllers/userController.js";
import verifyToken from "../middleware/auth.js";

// Routes
router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);
router.get("/:id", verifyToken, userController.getUserById);

export default router;
