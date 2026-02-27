"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rewards_controller_1 = require("../controller/rewards.controller");
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = express_1.default.Router();
router.get("/leaderboard", auth_middleware_1.default, rewards_controller_1.getLeaderboard);
router.get("/user", auth_middleware_1.default, rewards_controller_1.getUserDashboard);
exports.default = router;
