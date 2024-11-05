import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../firebaseConfig';
import { ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [user, setUser] = useState(null);
  const [prenom, setPrenom] = useState('');
  const [nom, setnom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        navigate('/');  // Redirige vers la page d'accueil si l'utilisateur est connecté
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Créer un utilisateur avec email et mot de passe
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Enregistrer le prénom dans la base de données sous le UID de l'utilisateur
      await set(ref(db, `users/${user.uid}`), {
        prenom: prenom,
        nom: nom,
        email: email,
        
      });

      
    } catch (err) {
      setError('Erreur lors de l\'inscription : ' + err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Créer un compte</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="prenom">Prénom :</label>
          <input
            type="text"
            id="prenom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="nom">Nom :</label>
          <input
            type="text" 
            id="nom"
            value={nom}
            onChange={(e) => setnom(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe :</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="register-btn">S'inscrire</button>
      </form>
    </div>
  );
};

export default Register;