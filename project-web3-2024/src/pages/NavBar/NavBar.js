// src/components/Navbar/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import ImageDisplay from '../../components/Image/ImageDisplay';
import './Navbar.css'; // Optional, if you want to add specific styling for the Navbar component

function Navbar({ user, handleLogout }) {
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
              <li><button onClick={handleLogout} className="logout-button">Déconnexion</button></li>
            </>
          )}
      </ul>
    </nav>
  );
}

export default Navbar;