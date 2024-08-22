//frontend/src/services/llm/api.js
import axios from 'axios';
import config from '../../config';

export const generateAIResponse = async (input) => {
    try {
        const url = `${config.CHAT_SERVICE_URL}/generate?prompt=${encodeURIComponent(input)}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let aiResponse = '';

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (value) {
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
        }

        return aiResponse;
    } catch (error) {
        console.error('Failed to fetch response from API:', error);
        throw error;
    }
};

export const checkServiceStatus = async () => {
    try {
        const response = await axios.get(config.CHAT_SERVICE_URL, {
            headers: {
                accept: 'application/json',
            },
        });

        if (response.status !== 200) {
            throw new Error('Network response was not ok');
        }
        return response.data['is ready'] === true;
    } catch (error) {
        console.error('Failed to fetch response from API:', error);
        throw error;
    }
};
