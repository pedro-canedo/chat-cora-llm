// services/ai/GeminiAIProvider.js
import { AIProvider } from './AIProvider';
import { generateAIResponseGemni, createSemanticContext } from '../gemini/api';

export class GeminiAIProvider extends AIProvider {
    async generateResponse(prompt) {
        return await generateAIResponseGemni(prompt);
    }

    async createSemanticContext(lastText) {
        return await createSemanticContext(lastText);
    }
}
