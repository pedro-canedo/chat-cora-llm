import { ref, set, remove } from 'firebase/database';
import { db } from '../../firebaseConfig';

export const addUserOnline = (user) => {
    const userRef = ref(db, `chat/onlineUsers/${user.uid}`);
    return set(userRef, {
        uid: user.uid,
        name: user.name,
    });
};

export const removeUserOnline = (uid) => {
    const userRef = ref(db, `chat/onlineUsers/${uid}`);
    return remove(userRef);
};
