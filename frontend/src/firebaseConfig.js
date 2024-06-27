// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAc81V2tG8pHaAUzQ4cJi44V2wSC51lT7Q",
    authDomain: "pco-systems.firebaseapp.com",
    projectId: "pco-systems",
    storageBucket: "pco-systems.appspot.com",
    messagingSenderId: "195541869097",
    appId: "1:195541869097:web:439aca1574d4a82b27b238",
    measurementId: "G-Q8VEJ7CNP7",
    databaseURL: "https://pco-systems-default-rtdb.firebaseio.com"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getDatabase(app);

export { auth, provider, analytics, db };
