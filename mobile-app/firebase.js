// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDH-IuJ-tTZiqVnl1tDDMSu9QQrsfhJlZs",
    authDomain: "handsignrecognizeapp.firebaseapp.com",
    projectId: "handsignrecognizeapp",
    storageBucket: "handsignrecognizeapp.firebasestorage.app",
    messagingSenderId: "831507513489",
    appId: "1:831507513489:web:e7ca585edaa00fd0093f30",
    measurementId: "G-3KV3GZPXC2"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
