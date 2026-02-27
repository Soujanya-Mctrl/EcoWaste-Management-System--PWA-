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
const express_1 = __importDefault(require("express"));
const Facilities_model_1 = __importDefault(require("../models/Facilities.model"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
const router = express_1.default.Router();
// Search recyclers by address only
router.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { query } = req.query;
        // If no query, return all facilities (or filter by state/rating as per design, but keeping existing search logic + design's GET /facilities pattern)
        if (!query) {
            // If no query, this might be a "get all" request logic or just return error as before?
            // Design says GET /facilities?state=...
            // Let's implement the GET /facilities logic here too or separate route?
            // "router.get('/search')" is specific. 
            // The design says "GET /facilities". 
            // Let's handle the root "/" GET for list/filter, and keep "/search" if needed or merge.
            // The user's original code had "/search".
            // I will implement GET / (root of this router) for listing to match design.
            // And keep /search for backward compatibility or merged utility.
        }
        // ... original logic ...
        if (!query) {
            res.status(400).json({ error: "Query parameter is required" });
            return;
        }
        const queryString = query;
        // Find all facilities (e.g., for a state)
        const facilities = yield Facilities_model_1.default.find();
        // Collect matching recyclers from all facilities
        let matchedRecyclers = [];
        let state = "";
        let total = 0;
        facilities.forEach(facility => {
            const filtered = facility.recyclers.filter(r => (r.address && r.address.toLowerCase().includes(queryString.toLowerCase())) ||
                (r.name && r.name.toLowerCase().includes(queryString.toLowerCase())));
            if (filtered.length > 0) {
                state = facility.state;
                total += filtered.length;
                matchedRecyclers = matchedRecyclers.concat(filtered.map(r => ({
                    name: r.name,
                    address: r.address,
                    quantity: r.quantity,
                    rating: r.rating
                })));
            }
        });
        const response = {
            state,
            total,
            recyclers: matchedRecyclers
        };
        res.json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
}));
// GET /facilities - List all facilities with filters
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { state, minRating } = req.query;
        const query = {};
        if (state) {
            query.state = state;
        }
        let facilities = yield Facilities_model_1.default.find(query);
        if (minRating) {
            const rating = Number(minRating);
            // Filter recyclers within facilities? Or facilities that have high rated recyclers?
            // Design implies filtering the list. 
            // "Show facility details (name, address, quantity, rating)"
            // Let's filter the recyclers inside the facilities.
            facilities = facilities.map(f => {
                const filteredRecyclers = f.recyclers.filter(r => (r.rating || 0) >= rating);
                // Return f with filtered recyclers? Or only if it has any?
                // Mongoose objects are immutable-ish, better to convert to object roughly or use lean()
                // For simplicity, we filter in memory.
                f.recyclers = filteredRecyclers;
                return f;
            }).filter(f => f.recyclers.length > 0);
        }
        res.json({
            facilities,
            total: facilities.length
        });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}));
// POST /facilities - Admin only
router.post("/", auth_middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (user.role !== 'admin') {
            res.status(403).json({ message: "Forbidden: Admin role required" });
            return;
        }
        const { state, total, recyclers } = req.body;
        if (!state || total === undefined || !recyclers) {
            res.status(400).json({ message: "Invalid input data" });
            return;
        }
        const facility = yield Facilities_model_1.default.create({
            state,
            total,
            recyclers
        });
        res.status(201).json({
            message: "Facility added successfully",
            facility
        });
    }
    catch (error) {
        console.error("Error creating facility:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
exports.default = router;
