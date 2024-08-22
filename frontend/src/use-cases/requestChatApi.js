import { AIFactory } from '../services/ai/AIFactory';

export const requestChatApi = async (input) => {
    const aiProvider = AIFactory();
    return aiProvider.generateResponse(input);
};

export const generateTileFromText = async (text) => {
    const prompt = `Gere pra mim, um texto que seja o título da nossa conversa baseada no seguinte texto? início -> ${text} <- fim, preciso que tenha no máximo 2 palavras`;
    return requestChatApi(prompt);
};
