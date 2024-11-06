// src/components/Navbar/Navbar.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImageDisplay from '../../components/Image/ImageDisplay';
import { auth } from '../../firebaseConfig';
import './Navbar.css';

function Navbar({ user, handleLogout }) {
  const [isEmailVerified, setIsEmailVerified] = useState(user?.emailVerified || false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.emailVerified) {
      const interval = setInterval(async () => {
        await user.reload();
        if (user.emailVerified) {
          setIsEmailVerified(true);
          clearInterval(interval); // Arrête l'intervalle une fois l'email vérifié
        }
      }, 3000); // Vérifie toutes les 3 secondes
      return () => clearInterval(interval);
    } else if (user && user.emailVerified) {
      setIsEmailVerified(true);
    }
  }, [user]);

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
        <li><Link to="/exemple">Exemple</Link></li>
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
