import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_AI_API_KEY,
    // @ts-ignore
    google_application_credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

export async function generateTypeWaste(base64ImageFile: string): Promise<string> {


    const contents = [
        {
            inlineData: {
                mimeType: "image/jpeg",
                data: base64ImageFile,
            },
        },
        { text: "Caption this image." },
    ];

    const response = await ai.models.generateContent({
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
}
