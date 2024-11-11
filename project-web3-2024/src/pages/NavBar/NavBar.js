// NavBar.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ImageDisplay from '../../components/Image/ImageDisplay';
import './Navbar.css';

function Navbar({ user, handleLogout }) {
  const [isEmailVerified, setIsEmailVerified] = useState(user?.emailVerified || false);
  const navigate = useNavigate();
  const location = useLocation();

  // Vérification immédiate de la vérification de l'email à chaque changement d'URL
  useEffect(() => {
    const checkEmailVerification = async () => {
      if (user && !user.emailVerified) {
        await user.reload();
        if (!user.emailVerified) {
          navigate('/register'); // Redirection immédiate vers l'inscription
        } else {
          setIsEmailVerified(true);
        }
      }
    };

    checkEmailVerification();
  }, [user, location, navigate]);

  // Intervalle de vérification toutes les 1 seconde pour maintenir la réactivité
  useEffect(() => {
    if (user && !user.emailVerified) {
      const interval = setInterval(async () => {
        await user.reload();
        if (user.emailVerified) {
          setIsEmailVerified(true);
          clearInterval(interval); // Arrête l'intervalle une fois l'email vérifié
        } else {
          setIsEmailVerified(false);
        }
      }, 1000); // Réduit l'intervalle à 1 seconde pour une réponse plus rapide
      return () => clearInterval(interval);
    } else if (user && user.emailVerified) {
      setIsEmailVerified(true);
    }
  }, [user, navigate]);

  const handleLogoutClick = () => {
    handleLogout();
    setIsEmailVerified(false);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <ImageDisplay imagePath="HomePage/logoM.png" altText="Logo du site" />
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/bodyMap">BodyMap</Link></li>
        <li><Link to="/bmi">BMI</Link></li>
        {!user ? (
          <>
            <li><Link to="/register">S'enregistrer</Link></li>
            <li><Link to="/login">Connexion</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/profil">Profil</Link></li>
            <li><button onClick={handleLogoutClick} className="logout-button">Déconnexion</button></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
