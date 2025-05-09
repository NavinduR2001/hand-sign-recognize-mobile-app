import { initializeApp } from 'firebase/app';

// Optionally import the services that you want to use
import {getAuth} from 'firebase/auth';
// import {...} from 'firebase/database';
import {getFirestore} from 'firebase/firestore';
// import {...} from 'firebase/functions';
import {getStorage} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDelDjQ8U78273YQypQAnWSx1Q28BLIU_0",
  authDomain: "wavewords-handsignrecognizeapp.firebaseapp.com",
  projectId: "wavewords-handsignrecognizeapp",
  storageBucket: "wavewords-handsignrecognizeapp.firebasestorage.app",
  messagingSenderId: "327567118103",
  appId: "1:327567118103:web:7dc28e3d7d699e44d57152"
};

export const Firebase_App = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

const auth = getAuth(Firebase_App);
const db = getFirestore(Firebase_App);
const storage = getStorage(Firebase_App);

export { auth, db, storage };