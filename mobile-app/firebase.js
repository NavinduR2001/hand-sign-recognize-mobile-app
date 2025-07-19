
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 👈 Add this
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5QktUpPbWbt9mzbL8fS07wy_QZxSewO0",
  authDomain: "loginfirebase-24cb3.firebaseapp.com",
  projectId: "loginfirebase-24cb3",
  storageBucket: "loginfirebase-24cb3.firebasestorage.app",
  messagingSenderId: "811134184854",
  appId: "1:811134184854:web:5f15483ecf84ccd1e2c1b7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app); // 👈 Export Firestore

export { auth };

