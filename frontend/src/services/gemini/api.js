// frontend/src/services/gemini/api.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../../config";

const genAI = new GoogleGenerativeAI(config.API_KEY_GEMNI);

export async function generateAIResponseGemni(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}


export async function createSemanticContext(lastText) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `gere para mim um contexto semantico do resumo do dialogo anterior -> ${lastText} <-`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}



