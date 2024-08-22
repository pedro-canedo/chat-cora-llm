import { ref, set, push, get, remove, update } from 'firebase/database';
import { db } from '../../firebaseConfig';
import { ConversationAnalyzer } from './Analysis';

const analyzer = new ConversationAnalyzer();

export const fetchUserConversations = (userId, callback) => {
    const userConvosRef = ref(db, `users/${userId}/conversations`);
    get(userConvosRef).then((snapshot) => {
        const data = snapshot.val();
        const convos = data ? Object.keys(data).map(id => ({ id, ...data[id] })) : [];
        callback(convos);
    }).catch((error) => {
        console.error("Error fetching conversations:", error);
    });
};

export const fetchMessagesFromDatabase = (userId, conversationId, callback) => {
    const messagesRef = ref(db, `users/${userId}/conversations/${conversationId}/messages`);
    get(messagesRef).then((snapshot) => {
        const data = snapshot.val();
        const msgs = data ? Object.keys(data).map(id => ({ id, ...data[id] })).sort((a, b) => a.timestamp - b.timestamp) : [];
        callback(msgs);
        localStorage.setItem(`messages_${conversationId}`, JSON.stringify(msgs));
    }).catch((error) => {
        console.error("Error fetching messages:", error);
    });
};

export const syncMessagesWithDatabase = async (userId, conversationId) => {
    try {
        const cachedMessages = localStorage.getItem(`messages_${conversationId}`);
        if (cachedMessages) {
            const messages = JSON.parse(cachedMessages);
            for (const msg of messages) {
                const msgRef = ref(db, `users/${userId}/conversations/${conversationId}/messages/${msg.id}`);
                await set(msgRef, msg);
            }
        }
    } catch (error) {
        console.error("Error syncing messages with database:", error);
    }
};

export const createConversation = async (userId, firstMessage, title) => {
    if (!firstMessage.trim()) {
        console.error("Cannot create conversation with empty first message");
        return null;
    }
    try {
        const newConversationRef = push(ref(db, `users/${userId}/conversations`));
        const newConversation = { id: newConversationRef.key, title };
        await set(newConversationRef, newConversation);

        return newConversation;
    } catch (error) {
        console.error("Error creating conversation:", error);
    }
};

export const sendMessage = async (userId, conversationId, messageContent) => {
    const userMessage = { content: messageContent.trim(), sender: 'Você', timestamp: Date.now() };
    if (!userMessage.content) {
        console.error("Error adding user message: No content provided");
        return null;
    }
    try {
        const newMessageRef = push(ref(db, `users/${userId}/conversations/${conversationId}/messages`));
        await set(newMessageRef, userMessage);

        const conversationRef = ref(db, `users/${userId}/conversations/${conversationId}`);
        const conversationSnapshot = await get(conversationRef);
        const conversationData = conversationSnapshot.val();

        if (conversationData && conversationData.title) {
            const messages = await new Promise(resolve => fetchMessagesFromDatabase(userId, conversationId, resolve));

            const userMessages = messages.filter(msg => msg.sender === "Você");

            if (userMessages.length > 0) {
                const analysis = await analyzer.analyzeConversation(userMessages);

                console.log('Sentiment Score:', analysis.sentimentScore);
                console.log('Category:', analysis.category);

                const analysisRef = ref(db, `users/${userId}/conversations/${conversationId}/analysis`);
                await update(analysisRef, {
                    sentimentScore: analysis.sentimentScore,
                    category: analysis.category,
                    lastAnalyzed: Date.now()
                });

                const userAnalysisRef = ref(db, `analyses/${userId}/${analysis.category}/${conversationId}`);
                await set(userAnalysisRef, {
                    sentimentScore: analysis.sentimentScore,
                    timestamp: Date.now(),
                    conversationId: conversationId,
                    title: conversationData.title
                });
            } else {
                console.log("Nenhuma mensagem do usuário encontrada para análise.");
            }
        } else {
            console.log("Conversa sem título, análise não realizada.");
        }

        return { id: newMessageRef.key, ...userMessage };
    } catch (error) {
        console.error("Error adding user message:", error);
    }
};



export const addAiMessage = async (userId, conversationId, aiMessage) => {
    aiMessage.content = aiMessage.content.trim();
    aiMessage.timestamp = Date.now();
    if (!aiMessage.content) {
        console.error("Error adding AI message: No content provided");
        return null;
    }
    try {
        const newMessageRef = push(ref(db, `users/${userId}/conversations/${conversationId}/messages`));
        aiMessage.id = newMessageRef.key;
        await set(newMessageRef, aiMessage);

        return { id: newMessageRef.key, ...aiMessage };
    } catch (error) {
        console.error("Error adding AI message:", error);
    }
};


export const clearChat = async (userId, conversationId) => {
    try {
        const convoRef = ref(db, `users/${userId}/conversations/${conversationId}`);
        await remove(convoRef);
        localStorage.removeItem(`messages_${conversationId}`);
    } catch (error) {
        console.error("Error deleting conversation:", error);
    }
};

export const deleteConversation = async (userId, conversationId) => {
    try {
        const convoRef = ref(db, `users/${userId}/conversations/${conversationId}`);
        await remove(convoRef);
        localStorage.removeItem(`messages_${conversationId}`);
    } catch (error) {
        console.error("Error deleting conversation:", error);
    }
};
