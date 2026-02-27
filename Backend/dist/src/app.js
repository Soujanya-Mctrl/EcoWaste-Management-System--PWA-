"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// @ts-ignore
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const report_routes_1 = __importDefault(require("./routes/report.routes"));
const facilities_routes_1 = __importDefault(require("./routes/facilities.routes"));
const rewards_routes_1 = __importDefault(require("./routes/rewards.routes"));
// @ts-ignore
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000", // your frontend URL
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/', user_routes_1.default);
app.use('/report', report_routes_1.default);
app.use('/facilities', facilities_routes_1.default);
app.use('/api', rewards_routes_1.default);
exports.default = app;
