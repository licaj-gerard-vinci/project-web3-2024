import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { auth, db } from '../../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ref, get, set } from 'firebase/database';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Utilisateur connecté:', userCredential.user);
        navigate('/');  // Redirige après la connexion
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const saveUserInfoToDatabase = async (user) => {
    const userRef = ref(db, `users/${user.uid}`);
    await set(userRef, {
      uid: user.uid,
      displayName: user.displayName || '',
      email: user.email,
      photoURL: user.photoURL || '',
      isAdmin: false,
      age: 0,
      gender: "",
      favorites: []
    });
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Vérifie si l'utilisateur existe dans la base de données
      const userRef = ref(db, `users/${user.uid}`);
      const userSnapshot = await get(userRef);
      if (!userSnapshot.exists()) {
        await saveUserInfoToDatabase(user);  // Sauvegarde automatique des informations utilisateur
        console.log('Utilisateur ajouté à la base de données');
      }

      console.log('Connexion avec Google réussie:', user);
      navigate('/');  // Redirige après la connexion
    } catch (error) {
      setError(error.message);
    }
  };

  const handleMicrosoftSignIn = async () => {
    const provider = new OAuthProvider('microsoft.com');

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Vérifie si l'utilisateur existe dans la base de données
      const userRef = ref(db, `users/${user.uid}`);
      const userSnapshot = await get(userRef);
      if (!userSnapshot.exists()) {
        await saveUserInfoToDatabase(user);  // Sauvegarde automatique des informations utilisateur
        console.log('Utilisateur ajouté à la base de données');
      }

      console.log('Connexion avec Microsoft réussie:', user);
      navigate('/');  // Redirige après la connexion
    } catch (error) {
      setError(error.message);
    }
  };

  if (user) {
    return null;  // Empêche l'affichage du formulaire si l'utilisateur est déjà connecté
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
        <div className="social-buttons">
          <button onClick={handleGoogleSignIn} className="social-button google">
            <i className="fab fa-google"></i> Se connecter avec Google
          </button>
          <button onClick={handleMicrosoftSignIn} className="social-button microsoft">
            <i className="fab fa-microsoft"></i> Se connecter avec Microsoft
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
