// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBQs5M3ZxQIfcPda9II1V3C8Bt7yXJfKjI",
  authDomain: "nursing-edu.firebaseapp.com",
  projectId: "nursing-edu",
  storageBucket: "nursing-edu.firebasestorage.app",
  messagingSenderId: "420956652237",
  appId: "1:420956652237:web:f708cbee691086101f9f84",
  measurementId: "G-8HPXJ5BJJN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
