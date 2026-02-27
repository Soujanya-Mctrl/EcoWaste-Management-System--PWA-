"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load environment variables first
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./src/app"));
const db_1 = __importDefault(require("./src/db/db"));
(0, db_1.default)();
const PORT = process.env.PORT || 4000;
app_1.default.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
