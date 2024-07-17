// frontend/src/services/gemini/api.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../../config";

const genAI = new GoogleGenerativeAI(config.API_KEY_GEMNI);

export async function generateAIResponse(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

export async function generateTileFromText(text) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Gere pra mim, um texto que seja o titulo da nossa conversa baseada no seguinte texto? inicio -> ${text} <- fim, preciso que tenha no máximo 2 palavras"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(response.text())
    return response.text();
}

//objetivo é criar um contexto semantico de acordo com o texto passado para sempre adicionar um contexto ao prompt para que a IA gere um texto mais coerente
export async function createSemanticContext(lastText) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `gere para mim um contexto semantico do resumo do dialogo anterior -> ${lastText} <-`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}



