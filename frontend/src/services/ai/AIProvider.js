// services/ai/AIProvider.js

export class AIProvider {
    async generateResponse(prompt) {
        throw new Error("Method 'generateResponse()' must be implemented.");
    }

    async createSemanticContext(lastText) {
        throw new Error("Method 'createSemanticContext()' must be implemented.");
    }
}
