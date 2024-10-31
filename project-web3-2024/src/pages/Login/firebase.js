// Import the necessary functions from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTzjA42vr0Ecz3U9k1NnRltzs9hawRW80",
  authDomain: "muscles-web3.firebaseapp.com",
  projectId: "muscles-web3",
  databaseURL: "https://muscles-web3-default-rtdb.europe-west1.firebasedatabase.app", // Remplacez ici par l'URL correcte
  storageBucket: "muscles-web3.appspot.com",
  messagingSenderId: "597277649833",
  appId: "1:597277649833:web:50ed1ab9e7e0bf65f3b2b8",
  measurementId: "G-FB4B9XM1D5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // Export auth to use in authentication
export const db = getDatabase(app); // Export database to use in real-time database