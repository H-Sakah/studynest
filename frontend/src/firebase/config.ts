import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: 'AIzaSyCg-5KbC-MwAerYVDpPvSm9A8Nd1oeKSqs',
  authDomain: 'studynest-8373b.firebaseapp.com',
  projectId: 'studynest-8373b',
  storageBucket: 'studynest-8373b.firebasestorage.app',
  messagingSenderId: '241731938919',
  appId: '1:241731938919:web:a82cf34261d5d0bf2a82c2',
  measurementId: 'G-9Y86TDR0LD',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
export { auth };
