import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { auth, db } from '../../../firebaseConfig';
import { ref, set, get } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './register.css';

const Register = () => {
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        if (!currentUser.emailVerified) {
          setIsPendingVerification(true);
          startEmailVerificationCheck(currentUser);
        } else {
          navigate('/'); // Redirige l'utilisateur vers le profil si l'email est vérifié
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const startEmailVerificationCheck = (user) => {
    const interval = setInterval(async () => {
      await user.reload();
      if (user.emailVerified) {
        clearInterval(interval); // Arrête l'intervalle si l'e-mail est vérifié
        setIsPendingVerification(false);
        navigate('/'); // Redirige vers le profil après vérification
      }
    }, 3000); // Vérifie toutes les 3 secondes
  };

  // Fonction pour vérifier si l'utilisateur existe déjà dans la base de données
  const checkIfUserExists = async (user) => {
    const userRef = ref(db, `users/${user.uid}`);
    const userSnapshot = await get(userRef);
    return userSnapshot.exists();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Créer l'utilisateur avec e-mail et mot de passe
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Envoyer un e-mail de vérification
      await sendEmailVerification(user);

      // Enregistrer les informations utilisateur dans la base de données
      await set(ref(db, `users/${user.uid}`), {
        prenom: prenom,
        nom: nom,
        email: email,
        isAdmin: false,
        age: 0,
        gender: "",
        favorites: []
      });

      setSuccess('Inscription réussie ! Vérifiez votre e-mail pour valider votre compte.');
      setIsPendingVerification(true);
    } catch (err) {
      setError('Erreur lors de l\'inscription : ' + err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userExists = await checkIfUserExists(user);

      if (!userExists) {
        // Enregistrer les informations utilisateur dans la base de données si c'est un nouvel utilisateur
        await set(ref(db, `users/${user.uid}`), {
          prenom: user.displayName ? user.displayName.split(' ')[0] : '',
          nom: user.displayName ? user.displayName.split(' ')[1] || '' : '',
          email: user.email,
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
        // Enregistrer les informations utilisateur dans la base de données si c'est un nouvel utilisateur
        await set(ref(db, `users/${user.uid}`), {
          prenom: user.displayName ? user.displayName.split(' ')[0] : '',
          nom: user.displayName ? user.displayName.split(' ')[1] || '' : '',
          email: user.email,
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

  if (isPendingVerification) {
    return (
      <div className="register-container">
        <h2>Attente de la validation</h2>
        <p>Veuillez vérifier votre e-mail pour valider votre compte.</p>
      </div>
    );
  }

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
          <button onClick={handleGoogleSignIn} className="social-button google">
            <i className="fab fa-google"></i> S'inscrire avec Google
          </button>
          <button onClick={handleMicrosoftSignIn} className="social-button microsoft">
            <i className="fab fa-microsoft"></i> S'inscrire avec Microsoft
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
