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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTypeWaste = generateTypeWaste;
const genai_1 = require("@google/genai");
const ai = new genai_1.GoogleGenAI({
    apiKey: process.env.GOOGLE_AI_API_KEY,
    // @ts-ignore
    google_application_credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS
});
function generateTypeWaste(base64ImageFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const contents = [
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64ImageFile,
                },
            },
            { text: "Caption this image." },
        ];
        const response = yield ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                systemInstruction: `
            Analyze the provided waste image and classify the waste into one of the following categories: plastic, biodegradable, or other. 
            Respond only with the waste type label. If the image is unclear or the waste type cannot be determined, 
            respond with 'unknown'
            and add emoji at the end according to the waste type:
            - Plastic: ♻️
            - Biodegradable: 🌿
            - Glass: 🏺
            - Metal: 🔩
            - Paper: 📄
            - Other: 🗑️
            `
            }
        });
        console.log(response.text);
        return response.text || "unknown";
    });
}
