<h1 align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=500&size=35&duration=4000&pause=1000&color=237BA1&center=true&vCenter=true&width=500&height=70&lines=Hi+There!%F0%9F%91%8B;Web+3+Project" alt="Typing SVG" />
  </a>
</h1>

<p align="center">
  <img alt="Project Logo" src="https://via.placeholder.com/300x150.png?text=Muscles+Map+Logo" />
</p>

<h2 align="center">🛠️ Languages & Frameworks Used 🛠️</h2>
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

## 🎯 Functional Goal of the Application

**Muscles Map** is an application dedicated to fitness enthusiasts, providing features centered around Firebase integration.

---

## 🕸️ Web Architecture Type

- **Architecture**: Single Page Application (SPA)
- **Frontend**: React
- **Backend**: Firebase

---

## 📦 Installation

### Prerequisites

Ensure the following are installed on your machine:
- [Node.js](https://nodejs.org/) and npm

### Installation

1. Cloner le repository : 
  git clone https://github.com/licaj-gerard-vinci/project-web3-2024.git

2. Installer npm :
  npm install

3. Créer le fichier nommé firebaseConfig.js dans le dossier src

4. Copier le code suivant dans le fichier firebaseConfig.js :

<div>
<li>import { initializeApp } from "firebase/app";</li>
<li>import { getAuth } from 'firebase/auth';</li>
<li>import { getDatabase } from 'firebase/database';</li>
<li>import { getStorage } from 'firebase/storage';</li>

<li>const firebaseConfig = {</li>
  <li>apiKey: "AIzaSyBTzjA42vr0Ecz3U9k1NnRltzs9hawRW80",</li>
  <li>authDomain: "muscles-web3.firebaseapp.com",</li>
  <li>projectId: "muscles-web3",</li>
  <li>databaseURL: "https://muscles-web3-default-rtdb.europe-west1.firebasedatabase.app",</li>
  <li>storageBucket: "muscles-web3.appspot.com",</li>
  <li>messagingSenderId: "597277649833",</li>
  <li>appId: "1:597277649833:web:50ed1ab9e7e0bf65f3b2b8",</li>
  <li>measurementId: "G-FB4B9XM1D5"</li>
};

<li>const app = initializeApp(firebaseConfig);</li>
<li>export const auth = getAuth(app);</li> 
<li>export const db = getDatabase(app);</li>
<li>export const storage = getStorage(app);</li>

</div>

</div>
</ul>
