import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:
    process.env.REACT_APP_FIREBASE_API_KEY ||
    "AIzaSyBMHk6IRgZG1S6eeoq1T7BTOSIaWnYxSSs",
  authDomain:
    process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ||
    "solarladder-2d47a.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "solarladder-2d47a",
  storageBucket:
    process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ||
    "solarladder-2d47a.firebasestorage.app",
  messagingSenderId:
    process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "816197589445",
  appId:
    process.env.REACT_APP_FIREBASE_APP_ID ||
    "1:816197589445:web:8909b5bd7d6636ba03d3ac",
  measurementId:
    process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-8N3ECNDM8Z",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
