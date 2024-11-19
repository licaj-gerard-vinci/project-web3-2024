import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CgDanger } from "react-icons/cg";
import './AuthForm.css';
import Login from '../Login/login';
import Register from '../Register/register';
import { auth } from '../../../firebaseConfig';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const [user, setUser] = useState(null);
  const [redirected, setRedirected] = useState(false); // Empêche les redirections multiples
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const isGoogleOrMicrosoft = currentUser.providerData.some(
          (provider) => provider.providerId === 'google.com' || provider.providerId === 'microsoft.com'
        );

        // Si connecté via Google/Microsoft ou si l'email est vérifié
        if ((isGoogleOrMicrosoft || currentUser.emailVerified) && !redirected) {
          setRedirected(true); // Active le drapeau pour éviter les redirections multiples
          navigate('/'); // Redirige vers la page d'accueil
        } else if (!currentUser.emailVerified) {
          setIsPendingVerification(true);
          const interval = setInterval(async () => {
            await currentUser.reload();
            if (currentUser.emailVerified) {
              clearInterval(interval); // Arrête l'intervalle une fois vérifié
              setIsPendingVerification(false);
              if (!redirected) {
                setRedirected(true); // Active le drapeau pour une seule redirection
                navigate('/'); // Redirige après la vérification de l'email
              }
            }
          }, 3000); // Vérifie toutes les 3 secondes
          return () => clearInterval(interval); // Nettoie l'intervalle au démontage
        }
      }
    });
    return () => unsubscribe();
  }, [navigate, redirected]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  if (isPendingVerification) {
    return (
      <div className="verification-container">
        <div className="verification-message">
          <CgDanger className="danger-icon" />
          <h2>Email Verification Pending</h2>
          <p>Please verify your email address to activate your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form-container">
      {isLogin ? (
        <Login toggleAuthForm={toggleForm} />
      ) : (
        <Register toggleAuthForm={toggleForm} />
      )}
    </div>
  );
};

export default AuthForm;