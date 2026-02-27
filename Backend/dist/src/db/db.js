"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function connectDB() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("MONGODB_URI is not defined in .env");
        return;
    }
    mongoose_1.default.connect(uri)
        .then(() => {
        console.log("Connected to DB");
    })
        .catch(err => {
        console.log(err);
    });
}
exports.default = connectDB;
