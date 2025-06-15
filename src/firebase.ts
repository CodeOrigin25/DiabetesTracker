// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore'; // ✅ Add this line

const firebaseConfig = {
  apiKey: "AIzaSyAKdpYPQqo1c0HLMru9W98T_QQAb5DkVQo",
  authDomain: "diabetes-tracker-52ca9.firebaseapp.com",
  projectId: "diabetes-tracker-52ca9",
  storageBucket: "diabetes-tracker-52ca9.appspot.com",
  messagingSenderId: "26227772187",
  appId: "1:26227772187:web:180cd4f08d5ff3d89b21be",
  measurementId: "G-VGE5LJMHDM"
};

const app = initializeApp(firebaseConfig);

// ✅ Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ Export Firestore

// Optional: Initialize Analytics
if (typeof window !== 'undefined') {
  getAnalytics(app);
}

export { app };
