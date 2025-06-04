// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCwUWOaSx9C_2C86ap6IQdvyJG--GT8FD4",
    authDomain: "researcher-platform.firebaseapp.com",
    projectId: "researcher-platform",
    storageBucket: "researcher-platform.firebasestorage.app",
    messagingSenderId: "572963013718",
    appId: "1:572963013718:web:0c4ddb34a0f55f928f27f7",
    measurementId: "G-Y054KR0N63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);