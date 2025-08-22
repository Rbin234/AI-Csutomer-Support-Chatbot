import express from "express";
import { handleHealthRequest,fetchHealthRequest } from "../controllers/healthController.js";

const router = express.Router();

// POST /api/health
router.post("/", handleHealthRequest);
router.get("/", fetchHealthRequest);

export default router;
