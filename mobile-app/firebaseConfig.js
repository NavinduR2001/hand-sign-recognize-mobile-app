// firebaseConfig.js
import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxx",
  authDomain: "wavewords-recentcalls.firebaseapp.com",
  projectId: "wavewords-recentcalls",
  storageBucket: "wavewords-recentcalls.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};

// Prevent initializing more than once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with the app
const db = getFirestore(app);

export { db };

