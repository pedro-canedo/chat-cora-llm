// services/ai/CustomAIProvider.js
import { generateAIResponse, checkServiceStatus } from '../../services/llm/api';
import { AIProvider } from './AIProvider';

export class CustomAIProvider extends AIProvider {
    async generateResponse(prompt) {
        return await generateAIResponse(prompt);
    }

    async createSemanticContext(lastText) {
    }
}