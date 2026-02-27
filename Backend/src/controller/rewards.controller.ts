import { Request, Response } from 'express';
import userModel from '../models/user.model';

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const topUsers = await userModel.find()
            .sort({ points: -1 })
            .select('username points role')
            .limit(10);

        // Map to expected frontend format
        const formattedUsers = topUsers.map((user, index) => {
            let badge = 'Eco Beginner';
            if (user.points >= 500) badge = 'Eco Leader';
            else if (user.points >= 250) badge = 'Eco Warrior';
            else if (user.points >= 100) badge = 'Eco Helper';

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
        const currentUserObj = (req as any).user;
        let currentUserData = null;

        if (currentUserObj) {
            // Find how many users have more points to determine rank
            const usersWithMorePoints = await userModel.countDocuments({
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
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const currentUser = (req as any).user;

        let badge = 'Eco Beginner';
        if (currentUser.points >= 500) badge = 'Eco Leader';
        else if (currentUser.points >= 250) badge = 'Eco Warrior';
        else if (currentUser.points >= 100) badge = 'Eco Helper';

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
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
