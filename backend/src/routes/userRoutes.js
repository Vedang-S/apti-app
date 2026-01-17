import express from "express";
const router = express.Router();
import { getProfile } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

router.get("/profile", authMiddleware, getProfile);

export default router;
