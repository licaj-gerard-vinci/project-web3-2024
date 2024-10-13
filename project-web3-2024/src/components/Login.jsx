import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';  // Fonction pour la connexion
import { auth } from '../firebase';  // Importer auth depuis firebase.js

const Login = () => {
  const [email, setEmail] = useState('');  // Stocke l'email de l'utilisateur
  const [password, setPassword] = useState('');  // Stocke le mot de passe
  const [error, setError] = useState('');  // Gérer les erreurs de connexion

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');  // Réinitialise l'erreur avant de tenter la connexion
    
    // Firebase auth pour connecter l'utilisateur
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Connexion réussie
        const user = userCredential.user;
        console.log('User signed in:', user);
      })
      .catch((error) => {
        // Gérer les erreurs de connexion
        setError(error.message);
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Affiche les erreurs s'il y en a */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}  // Met à jour l'état email
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}  // Met à jour l'état password
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
