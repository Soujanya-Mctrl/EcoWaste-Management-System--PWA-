import { Request, Response } from 'express';
// @ts-ignore
import jwt from "jsonwebtoken";
// @ts-ignore
import bcrypt from "bcryptjs";
import userModel, { IUser } from "../models/user.model";

export async function registerController(req: Request, res: Response): Promise<void> {
    try {
        const { username, email, password, role } = req.body;
        const userAlreadyExists = await userModel.findOne({ email: email });

        if (userAlreadyExists) {
            res.status(409).json({ message: "User with this email already exists" });
            return;
        }

        const existingUsername = await userModel.findOne({ username: username });
        if (existingUsername) {
            res.status(409).json({ message: "Username already exists" });
            return;
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        // Validate role
        const allowedRoles = ['user', 'green_champion', 'admin'];
        const userRole = allowedRoles.includes(role) ? role : 'user';

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword,
            points: 0,
            role: userRole
        });

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                points: user.points,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function loginController(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });

        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                points: user.points,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function logout(req: Request, res: Response): Promise<void> {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
}

export async function verifyController(req: Request, res: Response): Promise<void> {
    try {
        const user = (req as any).user;
        res.status(200).json({
            message: "Token is valid",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                points: user.points,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}
