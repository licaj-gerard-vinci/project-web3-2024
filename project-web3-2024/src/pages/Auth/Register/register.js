import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
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

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save user details to Firebase Realtime Database if the user signed up with Google
      await set(ref(db, `users/${user.uid}`), {
        prenom: user.displayName.split(' ')[0],  // Assuming the first name is in the displayName
        nom: user.displayName.split(' ')[1],    // Assuming the second name is in the displayName
        email: user.email,
        isAdmin: false,
        age: 0,
        gender: "",
        favorites: []
      });

      setSuccess('Inscription réussie avec Google!');
      navigate('/profil');  // Redirect to profile page after successful Google sign-up
    } catch (err) {
      setError('Erreur lors de l\'inscription avec Google : ' + err.message);
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
        {/* Google Sign-Up Button */}
      <div className="social-buttons">
        <button onClick={handleGoogleSignUp} className="social-button google">
          <i className="fab fa-google"></i> Sign in with Google
        </button>
        <button onClick={handleGoogleSignUp} className="social-button microsoft">
          <i className="fab fa-microsoft"></i> Sign in with Microsoft
        </button>
      </div>
      </form>
    </div>
  );
};

export default Register;