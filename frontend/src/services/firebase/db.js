// frontend/src/services/firebase/db.js
import { ref, set, push, onValue, remove } from 'firebase/database';
import { db } from '../../firebaseConfig';

// Função para buscar conversas de um usuário específico
export const fetchUserConversations = (userId, callback) => {
    const userConvosRef = ref(db, `users/${userId}/conversations`);
    onValue(userConvosRef, (snapshot) => {
        const data = snapshot.val();
        const convos = data ? Object.keys(data).map(id => ({ id, ...data[id] })) : [];
        callback(convos);
    }, (error) => {
        console.error("Error fetching conversations:", error);
    });
};

// Função para buscar mensagens de uma conversa específica
export const fetchMessagesFromDatabase = (userId, conversationId, callback) => {
    const messagesRef = ref(db, `users/${userId}/conversations/${conversationId}/messages`);
    onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        const msgs = data ? Object.keys(data).map(id => ({ id, ...data[id] })).sort((a, b) => a.timestamp - b.timestamp) : [];
        callback(msgs);
        localStorage.setItem(`messages_${conversationId}`, JSON.stringify(msgs));
    }, (error) => {
        console.error("Error fetching messages:", error);
    });
};

// Função para sincronizar mensagens com o banco de dados
export const syncMessagesWithDatabase = async (userId, conversationId) => {
    try {
        const cachedMessages = localStorage.getItem(`messages_${conversationId}`);
        if (cachedMessages) {
            const messages = JSON.parse(cachedMessages);
            messages.forEach(async (msg) => {
                const msgRef = ref(db, `users/${userId}/conversations/${conversationId}/messages/${msg.id}`);
                await set(msgRef, msg);
            });
        }
    } catch (error) {
        console.error("Error syncing messages with database:", error);
    }
};

// Função para criar uma nova conversa com base na primeira mensagem
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

// Função para enviar uma mensagem
export const sendMessage = async (userId, conversationId, messageContent) => {
    const userMessage = { content: messageContent.trim(), sender: 'Você', timestamp: Date.now() };
    if (!userMessage.content) {
        console.error("Error adding user message: No content provided");
        return null;
    }
    try {
        const newMessageRef = push(ref(db, `users/${userId}/conversations/${conversationId}/messages`));
        await set(newMessageRef, userMessage);
        return { id: newMessageRef.key, ...userMessage };
    } catch (error) {
        console.error("Error adding user message:", error);
    }
};

// Função para adicionar uma mensagem da IA
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

// Função para limpar uma conversa
export const clearChat = async (userId, conversationId) => {
    try {
        const convoRef = ref(db, `users/${userId}/conversations/${conversationId}`);
        await remove(convoRef);
        localStorage.removeItem(`messages_${conversationId}`);
    } catch (error) {
        console.error("Error deleting conversation:", error);
    }
};

// Função para excluir uma conversa específica
export const deleteConversation = async (userId, conversationId) => {
    try {
        const convoRef = ref(db, `users/${userId}/conversations/${conversationId}`);
        await remove(convoRef);
        localStorage.removeItem(`messages_${conversationId}`);
    } catch (error) {
        console.error("Error deleting conversation:", error);
    }
};
