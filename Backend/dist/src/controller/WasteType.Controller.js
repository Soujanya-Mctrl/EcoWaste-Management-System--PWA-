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
exports.updateReportStatus = exports.getAllReports = exports.createTypeController = void 0;
// @ts-ignore
const report_model_1 = __importDefault(require("../models/report.model"));
// @ts-ignore
const user_model_1 = __importDefault(require("../models/user.model"));
// @ts-ignore
const ai_service_1 = require("../service/ai.service");
const createTypeController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const file = req.file;
        if (!file) {
            res.status(400).json({ message: "No image file provided" });
            return;
        }
        const base64Image = Buffer.from(file.buffer).toString('base64');
        const content = yield (0, ai_service_1.generateTypeWaste)(base64Image);
        // Determine points and clean content
        let points = 0;
        let wasteType = 'unknown';
        let emoji = '';
        if (content.toLowerCase().includes("plastic")) {
            points = 10;
            wasteType = 'plastic';
            emoji = '♻️';
        }
        else if (content.toLowerCase().includes("biodegradable")) {
            points = 5;
            wasteType = 'biodegradable';
            emoji = '🌿';
        }
        else if (content.toLowerCase().includes("glass")) {
            // Points for glass/metal/paper/other not explicitly in design logic snippet but good to handle if AI returns them
            // Design says: plastic: 10, biodegradable: 5, other/unknown: 0.
            // Keeping design logic:
            points = 0;
            wasteType = 'glass';
            emoji = '🏺';
        }
        else if (content.toLowerCase().includes("metal")) {
            points = 0;
            wasteType = 'metal';
            emoji = '🔩';
        }
        else if (content.toLowerCase().includes("paper")) {
            points = 0;
            wasteType = 'paper';
            emoji = '📄';
        }
        else {
            wasteType = 'other';
            emoji = '🗑️';
        }
        // Get extra fields from body
        const { username, location, title, description, category } = req.body;
        const user = req.user;
        if (!user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        // Create report with all fields
        const post = yield report_model_1.default.create({
            image: file.path || "base64_placeholder", // In memory storage doesn't have path, usually we upload to cloud. 
            // Design says: "/uploads/..." - Assuming we might need to save file or just use base64 for now if no cloud storage?
            // "req.file.path" only exists if using diskStorage. We are using memoryStorage in routes.
            // For now, let's assume we handle file saving or just Mock string if not saving to disk.
            // actually, let's save the base64 or a placeholder if we aren't implementing file upload to disk/cloud yet.
            // Design Property 18: Report document should contain file path.
            // Creating a mock path for now since we haven't set up disk storage/cloud upload yet.
            // TODO: Implement actual file saving.
            username: username || ((_a = user === null || user === void 0 ? void 0 : user.username) !== null && _a !== void 0 ? _a : "Anonymous"),
            location: location || "Unknown",
            title: title,
            description: description,
            category: category || 'other',
            status: "pending",
            content: `${wasteType} ${emoji}`,
            points: points,
            user: user._id,
        });
        // Add points to user account if user exists and points > 0
        if (points > 0) {
            yield user_model_1.default.findByIdAndUpdate(user._id, { $inc: { points: points } });
        }
        res.status(201).json({
            message: "Report submitted successfully",
            report: post,
            classification: {
                wasteType: wasteType,
                emoji: emoji,
                pointsAwarded: points
            }
        });
    }
    catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createTypeController = createTypeController;
// Get all reports with filtering and pagination
const getAllReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, userId, limit = 50, offset = 0 } = req.query;
        const query = {};
        if (status)
            query.status = status;
        if (userId)
            query.user = userId;
        const reports = yield report_model_1.default.find(query)
            .sort({ createdAt: -1 })
            .skip(Number(offset))
            .limit(Number(limit));
        const total = yield report_model_1.default.countDocuments(query);
        res.json({
            reports,
            total,
            limit: Number(limit),
            offset: Number(offset)
        });
    }
    catch (err) {
        res.status(500).json({ message: "Failed to fetch reports" });
    }
});
exports.getAllReports = getAllReports;
// Update report status
const updateReportStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['pending', 'investigating', 'resolved', 'verified'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ message: "Invalid status value" });
            return;
        }
        // Check if user is authorized (e.g., green_champion or admin)
        // For now, assuming middleware handles basic auth, checking role here
        const user = req.user;
        if (user.role !== 'green_champion' && user.role !== 'admin') {
            res.status(403).json({ message: "Forbidden: Insufficient permissions" });
            return;
        }
        const report = yield report_model_1.default.findByIdAndUpdate(id, { status: status }, { new: true });
        if (!report) {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        res.json({
            message: "Report status updated",
            report
        });
    }
    catch (error) {
        console.error("Error updating report:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateReportStatus = updateReportStatus;
