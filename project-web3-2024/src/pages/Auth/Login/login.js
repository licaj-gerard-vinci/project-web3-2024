import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        if (currentUser.emailVerified) {
          navigate('/'); // Redirige vers la page d'accueil si l'utilisateur est vérifié
        } else {
          setIsPendingVerification(true);
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (!user.emailVerified) {
          setIsPendingVerification(true);
          sendEmailVerification(user);
        } else {
          navigate('/');
        }
      })
      .catch((error) => {
        setError(error.message);
      });
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

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userExists = await checkIfUserExists(user);

      if (userExists) {
        navigate('/');  // Redirige après la connexion
      } else {
        setError('Vous devez vous inscrire d\'abord !');
        navigate('/register', { state: { message: 'Vous devez vous inscrire d\'abord !' } });
      }
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

      if (userExists) {
        navigate('/');  // Redirige après la connexion
      } else {
        setError('Vous devez vous inscrire d\'abord !');
        navigate('/register', { state: { message: 'Vous devez vous inscrire d\'abord !' } });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (isPendingVerification) {
    return (
      <div className="login-container">
        <h2>Attente de la validation</h2>
        <p>Veuillez vérifier votre e-mail pour valider votre compte.</p>
      </div>
    );
  }

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
