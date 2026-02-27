import express from "express";
import { getLeaderboard, getUserDashboard } from "../controller/rewards.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();

router.get("/leaderboard", authMiddleware, getLeaderboard);
router.get("/user", authMiddleware, getUserDashboard);

export default router;
