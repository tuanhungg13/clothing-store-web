// Import the functions you need from the SDKs you need
"use client"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: "clothing-store-c363f.firebaseapp.com",
    projectId: "clothing-store-c363f",
    storageBucket: "clothing-store-c363f.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGSENDID,
    appId: NEXT_PUBLIC_APPID,
    measurementId: NEXT_PUBLIC_MEASUREMENTIFD = G - SREZLPL7W4
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { db, storage }
