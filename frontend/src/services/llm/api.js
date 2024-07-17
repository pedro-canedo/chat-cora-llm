import axios from 'axios';
import config from '../../config';

export const generateAIResponse = async (input) => {
    try {
        const response = await axios.post(`${config.CHAT_SERVICE_URL}/generate`, {
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
            if (value) {
                const chunkValue = decoder.decode(value, { stream: true });
                aiResponse += chunkValue;
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
