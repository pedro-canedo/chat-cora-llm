// frontend/src/services/llm/api.js
import axios from 'axios';
import config from '../../config';

export const generateAIResponse = async (input) => {
    try {
        const response = await axios.post(`${config.CHAT_SERVICE_URL}/generate`, {
            // model: 'llama3',
            prompt: input,
        }, { responseType: 'stream' });

        if (response.status !== 200) {
            throw new Error('Network response was not ok');
        }

        const reader = response.data.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let aiResponse = '';

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value, { stream: true });

            const lines = chunkValue.split('\n').filter(Boolean);
            for (const line of lines) {
                const parsed = JSON.parse(line);
                aiResponse += parsed.response;

                if (parsed.done) {
                    done = true;
                    break;
                }
            }
        }

        return aiResponse;
    } catch (error) {
        console.error('Failed to fetch response from API:', error);
        throw error;
    }
};
