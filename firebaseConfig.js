// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDIFx7OWTqrc0tEDPq4daPGRodCA4GhKas",
    authDomain: "insert-function.firebaseapp.com",
    projectId: "insert-function",
    storageBucket: "insert-function.appspot.com",
    messagingSenderId: "621481245021",
    appId: "1:621481245021:web:7336d4c27364822c0a10b4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue };
