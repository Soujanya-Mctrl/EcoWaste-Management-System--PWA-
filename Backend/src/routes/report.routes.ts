import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import { createTypeController, getAllReports, updateReportStatus } from "../controller/WasteType.Controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post('/image',
    authMiddleware,
    upload.single('image'),
    createTypeController
);

router.get('/list',
    authMiddleware,
    getAllReports
);

router.patch('/:id/status',
    authMiddleware,
    updateReportStatus
);

export default router;
