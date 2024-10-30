// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTzjA42vr0Ecz3U9k1NnRltzs9hawRW80",
  authDomain: "muscles-web3.firebaseapp.com",
  projectId: "muscles-web3",
  storageBucket: "muscles-web3.appspot.com",
  messagingSenderId: "597277649833",
  appId: "1:597277649833:web:50ed1ab9e7e0bf65f3b2b8",
  measurementId: "G-FB4B9XM1D5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); 

export { auth , analytics };