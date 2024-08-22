// services/ai/AIFactory.js
import config from '../../config';
import { CustomAIProvider } from './CustomAIProvider';
import { GeminiAIProvider } from './GeminiAIProvider';

export const AIFactory = () => {
    const provider = config.AI_PROVIDER;

    switch (provider) {
        case 'gemini':
            return new GeminiAIProvider();
        case 'custom':
            return new CustomAIProvider();
        default:
            throw new Error(`AI_PROVIDER not set or invalid: ${provider}`);
    }
};
