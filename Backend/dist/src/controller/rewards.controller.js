"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDashboard = exports.getLeaderboard = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const getLeaderboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topUsers = yield user_model_1.default.find()
            .sort({ points: -1 })
            .select('username points role')
            .limit(10);
        // Map to expected frontend format
        const formattedUsers = topUsers.map((user, index) => {
            let badge = 'Eco Beginner';
            if (user.points >= 500)
                badge = 'Eco Leader';
            else if (user.points >= 250)
                badge = 'Eco Warrior';
            else if (user.points >= 100)
                badge = 'Eco Helper';
            return {
                id: user._id,
                name: user.username,
                points: user.points,
                rank: index + 1,
                badge: badge,
                avatar: undefined // Will use default placeholder on frontend
            };
        });
        // Find current user's rank
        const currentUserObj = req.user;
        let currentUserData = null;
        if (currentUserObj) {
            // Find how many users have more points to determine rank
            const usersWithMorePoints = yield user_model_1.default.countDocuments({
                points: { $gt: currentUserObj.points }
            });
            currentUserData = {
                id: currentUserObj._id,
                rank: usersWithMorePoints + 1,
                points: currentUserObj.points
            };
        }
        res.status(200).json({
            topUsers: formattedUsers,
            currentUser: currentUserData
        });
    }
    catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getLeaderboard = getLeaderboard;
const getUserDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentUser = req.user;
        let badge = 'Eco Beginner';
        if (currentUser.points >= 500)
            badge = 'Eco Leader';
        else if (currentUser.points >= 250)
            badge = 'Eco Warrior';
        else if (currentUser.points >= 100)
            badge = 'Eco Helper';
        // Format to match frontend requirements
        const userData = {
            id: currentUser._id,
            name: currentUser.username,
            email: currentUser.email,
            points: currentUser.points,
            badge: badge,
            history: [] // Mocking empty history for now since there handles no model for it
        };
        res.status(200).json(userData);
    }
    catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUserDashboard = getUserDashboard;
