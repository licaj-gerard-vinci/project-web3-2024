import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { auth, db } from '../../../firebaseConfig';
import { ref, set } from 'firebase/database';
import { useNavigate, useLocation } from 'react-router-dom';
import './register.css';

const Register = () => {
  const [user, setUser] = useState(null);
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();  // Get the location object to access state

  const message = location.state?.message || '';  // Retrieve the message passed from Login.js

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        navigate('/profil');  // Redirect to the profile page if logged in
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user info to Firebase Realtime Database
      await set(ref(db, `users/${user.uid}`), {
        prenom: prenom,
        nom: nom,
        email: email,
        isAdmin: false,
        age: 0,
        gender: "",
        favorites: []
      });

      setSuccess('Inscription réussie!');
      navigate('/profil');  // Redirect to profile page after successful registration
    } catch (err) {
      setError('Erreur lors de l\'inscription : ' + err.message);
    }
  };

  // Nouvelle fonction pour sauvegarder les informations utilisateur dans la base de données
  const saveUserInfoToDatabase = async (user, additionalInfo = {}) => {
    const userRef = ref(db, `users/${user.uid}`);
    await set(userRef, {
      uid: user.uid,
      prenom: additionalInfo.prenom || user.displayName.split(' ')[0] || '',
      nom: additionalInfo.nom || user.displayName.split(' ')[1] || '',
      email: user.email,
      photoURL: user.photoURL || '',
      isAdmin: false,
      age: additionalInfo.age || 0,
      gender: additionalInfo.gender || "",
      favorites: additionalInfo.favorites || []
    });
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Sauvegarde des informations utilisateur dans la base de données
      await saveUserInfoToDatabase(user);
      setSuccess('Inscription réussie avec Google!');
      navigate('/profil');  // Redirige après l'inscription réussie avec Google
    } catch (err) {
      setError('Erreur lors de l\'inscription avec Google : ' + err.message);
    }
  };

  const handleMicrosoftSignUp = async () => {
    const provider = new OAuthProvider('microsoft.com');

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Sauvegarde des informations utilisateur dans la base de données
      await saveUserInfoToDatabase(user);
      setSuccess('Inscription réussie avec Microsoft!');
      navigate('/profil');  // Redirige après l'inscription réussie avec Microsoft
    } catch (err) {
      setError('Erreur lors de l\'inscription avec Microsoft : ' + err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Créer un compte</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      {message && <p className="message">{message}</p>} {/* Display the message from Login.js */}

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
            onChange={(e) => setNom(e.target.value)}
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
        
        <div className="social-buttons">
          <button onClick={handleGoogleSignUp} className="social-button google">
            <i className="fab fa-google"></i> S'inscrire avec Google
          </button>
          <button onClick={handleMicrosoftSignUp} className="social-button microsoft">
            <i className="fab fa-microsoft"></i> S'inscrire avec Microsoft
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
