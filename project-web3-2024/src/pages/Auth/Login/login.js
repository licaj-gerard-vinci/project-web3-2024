import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { auth, db } from '../../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import '@fortawesome/fontawesome-free/css/all.min.css';  // Import Font Awesome styles
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
        navigate('/');  // Redirect to home if logged in
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('User signed in:', userCredential.user);
        navigate('/');  // Redirect after successful login
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const checkIfUserExists = async (user) => {
    const userRef = ref(db, `users/${user.uid}`);
    const userSnapshot = await get(userRef);
    if (userSnapshot.exists()) {
      return true;  // User exists in the database
    } else {
      return false;  // User does not exist
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user exists in the database
      const userExists = await checkIfUserExists(user);

      if (userExists) {
        console.log('Google sign-in successful:', user);
        navigate('/');  // Redirect after successful Google login
      } else {
        // User does not exist, redirect to register page with message
        setError('You need to register first!');
        navigate('/register', { state: { message: 'You need to register first!' } });
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

      // Check if the user exists in the database
      const userExists = await checkIfUserExists(user);

      if (userExists) {
        console.log('Microsoft sign-in successful:', user);
        navigate('/');  // Redirect after successful Microsoft login
      } else {
        // User does not exist, redirect to register page with message
        setError('You need to register first!');
        navigate('/register', { state: { message: 'You need to register first!' } });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (user) {
    return null;  // Prevent showing the login form if the user is already logged in
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
            <i className="fab fa-google"></i> Sign in with Google
          </button>
          <button onClick={handleMicrosoftSignIn} className="social-button microsoft">
            <i className="fab fa-microsoft"></i> Sign in with Microsoft
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;