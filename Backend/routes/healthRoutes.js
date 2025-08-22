import express from "express";
import { handleHealthRequest } from "../controllers/healthController.js";

const router = express.Router();

// POST /api/health
router.post("/", handleHealthRequest);

export default router;
