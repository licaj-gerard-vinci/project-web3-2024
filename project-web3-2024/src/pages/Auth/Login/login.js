import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ref, get, set } from 'firebase/database';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        navigate('/'); // Redirige vers la page d'accueil si l'utilisateur est vérifié
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userExists = await checkIfUserExists(user);

      if (userExists) {
        navigate('/'); // Redirige si l'utilisateur existe
      } else {
        navigate('/register', { state: { message: 'Vous devez vous inscrire d\'abord !' } });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Veuillez entrer votre adresse e-mail pour réinitialiser le mot de passe.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setError('');
    } catch (error) {
      setError("Erreur lors de l'envoi de l'email de réinitialisation : " + error.message);
    }
  };

  const checkIfUserExists = async (user) => {
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);
    return snapshot.exists();
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
    provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      // Log pour vérifier les informations récupérées
      console.log("User data from Google:", user);
  
      const userExists = await checkIfUserExists(user);

      console.log(user.uid);
      
      
      if (!userExists) {
        await set(ref(db, `users/${user.uid}`), {
          prenom: user.displayName ? user.displayName.split(' ')[0] : '',
          nom: user.displayName ? user.displayName.split(' ')[1] || '' : '',
          email: user.email,
          photoURL: user.photoURL,
          isAdmin: false,
          age: 0,
          gender: "",
          favorites: []
        });
      }
  
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

      const userExists = await checkIfUserExists(user);

      if (!userExists) {
        await set(ref(db, `users/${user.uid}`), {
          prenom: user.displayName ? user.displayName.split(' ')[0] : '',
          nom: user.displayName ? user.displayName.split(' ')[1] || '' : '',
          email: user.email,
          isAdmin: false,
          photoURL: user.photoURL,
          age: 0,
          gender: "",
          favorites: []
        });
      }

      navigate('/');  // Redirige après la connexion
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {resetEmailSent && <p style={{ color: 'green' }}>E-mail de réinitialisation envoyé. Vérifiez votre boîte de réception.</p>}
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
        <p className="forgot-password-link" onClick={handlePasswordReset}>
          Mot de passe oublié ?
        </p>
        <p>
          Pas encore de compte ? <Link to="/register" className="forgot-password-link">S'inscrire</Link>
        </p>
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
