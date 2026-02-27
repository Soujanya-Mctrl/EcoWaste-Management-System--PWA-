"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const WasteType_Controller_1 = require("../controller/WasteType.Controller");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = express_1.default.Router();
router.post('/image', auth_middleware_1.default, upload.single('image'), WasteType_Controller_1.createTypeController);
router.get('/list', auth_middleware_1.default, WasteType_Controller_1.getAllReports);
router.patch('/:id/status', auth_middleware_1.default, WasteType_Controller_1.updateReportStatus);
exports.default = router;
