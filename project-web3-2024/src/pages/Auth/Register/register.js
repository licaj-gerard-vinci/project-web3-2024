import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { auth, db } from '../../../firebaseConfig';
import { ref, set, get } from 'firebase/database';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage';
import './register.css';
import { useNavigate } from 'react-router-dom';

const Register = ({ toggleAuthForm }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null); // État pour l'URL de l'image de fond
  const navigate = useNavigate();

  useEffect(() => {
    // Récupération de l'image de fond depuis Firebase Storage
    const fetchBackgroundImage = async () => {
      const storage = getStorage();
      const backgroundRef = storageRef(storage, 'AuthPage/authImage.jpeg');

      try {
        const url = await getDownloadURL(backgroundRef);
        setBackgroundImage(url);
      } catch (error) {
        console.error('Error retrieving the background image:', error);
      }
    };

    fetchBackgroundImage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      await set(ref(db, `users/${user.uid}`), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        isAdmin: false,
        age: 0,
        gender: "",
        favorites: []
      });

      setSuccess('Registration successful! Check your email to verify your account.');
    } catch (err) {
      setError('Error during registration: ' + err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!(await checkIfUserExists(user))) {
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
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleMicrosoftSignIn = async () => {
    const provider = new OAuthProvider('microsoft.com');
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!(await checkIfUserExists(user))) {
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
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const checkIfUserExists = async (user) => {
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);
    return snapshot.exists();
  };

  return (
    <div className="register-container">
      <div className="image-container" style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        flex: 1
      }}></div>
      <div className="register-form-container">
        <h2>Create an Account</h2>
        <p>Already have an account? <span className="trial-link" onClick={toggleAuthForm}>Sign in</span></p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name:</label>
          <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <label htmlFor="lastName">Last Name:</label>
          <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Register</button>
          <p className="or-continue-with">or register with</p>
          <div className="social-buttons">
            <button onClick={handleGoogleSignIn} className="social-button google">
              <i className="fab fa-google"></i> Register with Google
            </button>
            <button onClick={handleMicrosoftSignIn} className="social-button microsoft">
              <i className="fab fa-microsoft"></i> Register with Microsoft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
