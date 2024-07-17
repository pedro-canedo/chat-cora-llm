import { checkServiceStatus, generateAIResponse } from '../services/llm/api';
import { generateAIResponseGemni } from '../services/gemini/api';


export const requestChatApi = async (input) => {
    if (await checkServiceStatus()) {
        return generateAIResponse(input);
    }
    return generateAIResponseGemni(input);
}


export const generateTileFromText = async (text) => {
    const prompt = `Gere pra mim, um texto que seja o titulo da nossa conversa baseada no seguinte texto? inicio -> ${text} <- fim, preciso que tenha no máximo 2 palavras`;
    return requestChatApi(prompt);
}
