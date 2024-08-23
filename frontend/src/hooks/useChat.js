import { useState, useEffect } from 'react';
import { ref, onValue, push, set, remove, onDisconnect } from 'firebase/database';
import { db, auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

export const useChat = () => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [user] = useAuthState(auth);

    useEffect(() => {
        if (user) {
            const userRef = ref(db, `chat/onlineUsers/${user.uid}`);

            set(userRef, {
                uid: user.uid,
                name: user.displayName || user.email.split('@')[0],
            });
            onDisconnect(userRef).remove();
        }

        const usersRef = ref(db, 'chat/onlineUsers');
        onValue(usersRef, (snapshot) => {
            const onlineUsers = snapshot.val() || {};
            setUsers(Object.values(onlineUsers));
        });

        return () => {
            if (user) {
                const userRef = ref(db, `chat/onlineUsers/${user.uid}`);
                remove(userRef);
            }
        };
    }, [user]);

    useEffect(() => {
        const messagesRef = ref(db, 'chat/messages');
        onValue(messagesRef, (snapshot) => {
            const chatMessages = snapshot.val() || {};
            setMessages(Object.values(chatMessages));
        });
    }, []);

    const sendMessage = async (content) => {
        const newMessageRef = push(ref(db, 'chat/messages'));
        await set(newMessageRef, {
            content,
            sender: user ? user.displayName || user.email.split('@')[0] : 'Anônimo',
            timestamp: Date.now(),
        });
    };

    return { users, messages, sendMessage };
};
