// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "organisio-app.firebaseapp.com",
  projectId: "organisio-app",
  storageBucket: "organisio-app.firebasestorage.app",
  messagingSenderId: "1039367273874",
  appId: "1:1039367273874:web:939832f88470e5cfaf554b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
