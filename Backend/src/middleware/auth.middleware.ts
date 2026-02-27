import { Request, Response, NextFunction } from 'express';
// @ts-ignore
import jwt from "jsonwebtoken";
import userModel from "../models/user.model";

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: any; // Replace 'any' with IUser interface if possible, but keep simple for now
        }
    }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        console.log("Auth Middleware Hit - Path:", req.path);
        console.log("Cookies:", req.cookies);
        console.log("Auth Header:", req.headers.authorization);

        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            console.log("No token found");
            res.status(401).json({
                message: "Unauthorized user"
            });
            return;
        }

        console.log("Decoding token...");
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log("Decoded Token:", decoded);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            console.log("User not found in DB with ID:", decoded.id);
            res.status(401).json({
                message: "Unauthorized user"
            });
            return;
        }

        req.user = user;
        console.log("Auth successful for user:", user.email);

        next();

    } catch (err: any) {
        console.error("Auth Middleware Error:", err.message);
        res.status(401).json({
            message: "Unauthorized user"
        });
    }
};

export default authMiddleware;
