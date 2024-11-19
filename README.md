<h1 align="center">
<a href="https://git.io/typing-svg"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=35&duration=4000&pause=1000&color=237BA1&center=true&vCenter=true&random=false&width=500&height=70&lines=Hi+There!%F0%9F%91%8B;Web+3+Project" alt="Typing SVG" /></a>
</h1>

<h2 align="center">🛠️ Languages-Frameworks Used 🛠️</h2>
<br/>
<div align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=js,html,css,react" /><br>
  </a>
</div>

<div align="center">
  <h2>Framework</h2>
  <br>
    <img alt="snake eating my contributions" src="https://skillicons.dev/icons?i=firebase" />
  <br/>
    <h2>But fonctionnel de l'application</h2>
  <ul>
<li>Muscles Map est une application dédiée aux passionnés de musculation, offrant des fonctionnalités qui sont tournées autour de l'utilisation de firebase.
</li>

  <h2>Type d'architecture web</h2>
<li>Single Page Application (SPA)</li>
<li>Frontend : React</li>
<li>Backend : Firebase</li>

  <h2>Installation</h2>
### Prérequis

1. Node.js et npm installés sur votre machine.

### Installation

1. Cloner le repository : 
  git clone https://github.com/licaj-gerard-vinci/project-web3-2024.git

2. Installer npm :
  npm install

3. Créer le fichier nommé firebaseConfig.js dans le dossier src

4. Copier le code suivant dans le fichier firebaseConfig.js :
  // Import the necessary functions from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage'; 

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
export const db = getDatabase(app); // Export database to use in real-time database// Export Realtime Database
export const storage = getStorage(app); // Export Firebase Storage

</div>
</ul>
