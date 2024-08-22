
import { categories } from './const';
import Sentiment from 'sentiment';

export class ConversationAnalyzer {
    constructor() {
        this.sentimentAnalyzer = new Sentiment();
        this.categories = categories;
    }

    async analyzeSentiment(text) {
        const result = this.sentimentAnalyzer.analyze(text);
        console.log("Sentiment analysis result:", result);
        return result.score;
    }

    async categorizeConversation(text) {
        let categoryScores = { 'outros': 0 };
        for (const [category, keywords] of Object.entries(this.categories)) {
            categoryScores[category] = 0;
            for (const keyword of keywords) {
                if (text.toLowerCase().includes(keyword)) {
                    categoryScores[category]++;
                }
            }
        }

        let topCategory = 'outros';
        let maxScore = 0;

        for (const [category, score] of Object.entries(categoryScores)) {
            if (score > maxScore) {
                maxScore = score;
                topCategory = category;
            }
        }
        return topCategory;
    }

    async analyzeConversation(messages) {
        let combinedText = messages.map(msg => msg.content).join(' ');
        let sentimentScore = await this.analyzeSentiment(combinedText);
        let category = await this.categorizeConversation(combinedText);

        return {
            sentimentScore,
            category
        };
    }
}
