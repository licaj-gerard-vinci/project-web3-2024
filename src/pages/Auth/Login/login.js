import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ref, get, set } from 'firebase/database';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './login.css';

const Login = ({ toggleAuthForm }) => {// Ajout de toggleAuthForm en prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null); // État pour l'URL de l'image de fond
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser && currentUser.emailVerified) {
        navigate('/'); // Redirige vers la page d'accueil si l'utilisateur est vérifié
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Récupération de l'image de fond depuis Firebase Storage
    const fetchBackgroundImage = async () => {
      const storage = getStorage();
      const backgroundRef = storageRef(storage, 'AuthPage/authImage.jpeg');

      try {
        const url = await getDownloadURL(backgroundRef);
        setBackgroundImage(url);
      } catch (error) {
        console.error('Error retrieving background image:', error);
      }
    };

    fetchBackgroundImage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Réinitialise les erreurs

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userExists = await checkIfUserExists(user);

      if (userExists) {
        navigate('/'); // Redirige si l'utilisateur existe
      } else {
        toggleAuthForm(); // Passe à l'inscription si l'utilisateur n'existe pas
      }
    } catch (error) {
      console.log('Firebase error code:', error.code); // Log pour les développeurs
      console.log('Firebase error message:', error.message);
    
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email. Please check or register.');
          break;
    
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
    
        case 'auth/invalid-email':
          setError('Invalid email format. Please enter a valid email address.');
          break;
    
        default:
          setError('Incorrect password or no account found with this email. Please try again.');
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email to reset your password.");      
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
      setError('');
      alert('Password reset email sent. Check your inbox.');
    } catch (error) {
      setError("Error sending reset email: " + error.message);    
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
  
      console.log("User data from Google:", user);
  
      const userExists = await checkIfUserExists(user);

      console.log(user.uid);
      
      if (!userExists) {
        await set(ref(db, `users/${user.uid}`), {
          firstName: user.displayName ? user.displayName.split(' ')[0] : '',
          lastName: user.displayName ? user.displayName.split(' ')[1] || '' : '',
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
          firstName: user.displayName ? user.displayName.split(' ')[0] : '',
          lastName: user.displayName ? user.displayName.split(' ')[1] || '' : '',
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

  return (
    <div className="login-container">
      <div className="image-container" style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        flex: 1
      }}></div>
      <div className="login-form-container">
        <h2>Sign in to your account</h2>
        <p>
          Not a member? <span className="trial-link" onClick={toggleAuthForm}>Register now</span>
        </p>
         {/* Message d'erreur */}
         {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email address:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign in</button>
          <a href="#" className="forgot-password-link" onClick={handlePasswordReset}>
            Forgot password?
          </a>
          <p className="or-continue-with">or continue with</p>
          <div className="social-buttons">
            <button className="social-button google" onClick={handleGoogleSignIn}>
              <i className="fab fa-google"></i> Google
            </button>
            <button className="social-button microsoft" onClick={handleMicrosoftSignIn}>
              <i className="fab fa-microsoft"></i> Microsoft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
