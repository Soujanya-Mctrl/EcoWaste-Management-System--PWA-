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
exports.registerController = registerController;
exports.loginController = loginController;
exports.logout = logout;
exports.verifyController = verifyController;
// @ts-ignore
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// @ts-ignore
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
function registerController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, email, password, role } = req.body;
            const userAlreadyExists = yield user_model_1.default.findOne({ email: email });
            if (userAlreadyExists) {
                res.status(409).json({ message: "User with this email already exists" });
                return;
            }
            const existingUsername = yield user_model_1.default.findOne({ username: username });
            if (existingUsername) {
                res.status(409).json({ message: "Username already exists" });
                return;
            }
            const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
            // Validate role
            const allowedRoles = ['user', 'green_champion', 'admin'];
            const userRole = allowedRoles.includes(role) ? role : 'user';
            const user = yield user_model_1.default.create({
                username,
                email,
                password: hashedPassword,
                points: 0,
                role: userRole
            });
            const token = jsonwebtoken_1.default.sign({
                id: user._id,
                role: user.role
            }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
        }
        catch (error) {
            console.error("Registration error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}
function loginController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const user = yield user_model_1.default.findOne({ email: email });
            if (!user) {
                res.status(401).json({ message: "Invalid credentials" });
                return;
            }
            const isPasswordValid = bcryptjs_1.default.compareSync(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ message: "Invalid credentials" });
                return;
            }
            const token = jsonwebtoken_1.default.sign({
                id: user._id,
                role: user.role
            }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
        }
        catch (error) {
            console.error("Login error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    });
}
function verifyController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.user;
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
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    });
}
