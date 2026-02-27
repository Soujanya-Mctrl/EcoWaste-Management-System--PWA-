import express from "express";
import { registerController, loginController, logout, verifyController } from "../controller/auth.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', logout);
router.get('/verify', authMiddleware, verifyController);

export default router;
