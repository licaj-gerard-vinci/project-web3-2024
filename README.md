<h1 align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=35&duration=4000&pause=1000&color=237BA1&center=true&vCenter=true&width=500&height=70&lines=Bonjour+!%F0%9F%91%8B;Projet+Web+3" alt="Typing SVG" />
  </a>
</h1>

<p align="center">
  <img alt="Logo du projet" src="https://i.postimg.cc/Hs7pT2wP/logoM.png" width="300" />
</p>

<h2 align="center">🛠️ Langages et Frameworks Utilisés 🛠️</h2>
<br/>
<div align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=js,html,css,react" /><br>
  </a>
</div>

<h2 align="center">⚙️ Framework ⚙️</h2>
<br>
<div align="center">
  <img src="https://skillicons.dev/icons?i=firebase" alt="Firebase" />
</div>

---

## 🎯 Objectif Fonctionnel de l'Application

**Muscles Map** est une application dédiée aux passionnés de musculation, offrant des fonctionnalités basées sur l'intégration de Firebase.

---

## 🕸️ Type d'Architecture Web

- **Architecture** : Single Page Application (SPA)
- **Frontend** : React
- **Backend** : Firebase

---

## 📦 Installation

### Prérequis

Assurez-vous que les outils suivants sont installés sur votre machine :
- [Node.js](https://nodejs.org/) et npm

### Étapes d'installation1. Cloner le repository : 
  1. **Cloner le repository** :
```bash
   git clone https://github.com/licaj-gerard-vinci/project-web3-2024.git
```

2. **Installer npm :**
```bash
   npm install
```

3. **Créer le fichier nommé firebaseConfig.js dans le dossier src**


4. **Copier le code suivant dans le fichier firebaseConfig.js :**
```js
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage'; 

const firebaseConfig = {
  apiKey: "AIzaSyBTzjA42vr0Ecz3U9k1NnRltzs9hawRW80",
  authDomain: "muscles-web3.firebaseapp.com",
  projectId: "muscles-web3",
  databaseURL: "https://muscles-web3-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "muscles-web3.appspot.com",
  messagingSenderId: "597277649833",
  appId: "1:597277649833:web:50ed1ab9e7e0bf65f3b2b8",
  measurementId: "G-FB4B9XM1D5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);
```
5. **Démarrer le serveur de développement** :
```bash
   npm start
```
