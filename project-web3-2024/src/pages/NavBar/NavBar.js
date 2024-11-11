// NavBar.js
import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ImageDisplay from '../../components/Image/ImageDisplay';
import './Navbar.css';

function Navbar({ user, handleLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <ImageDisplay imagePath="HomePage/logoM.png" altText="Logo du site" />
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/" className={`navbar-item ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
        </li>
        <li>
          <Link to="/bodyMap" className={`navbar-item ${location.pathname === '/bodyMap' ? 'active' : ''}`}>BodyMap</Link>
        </li>
        {!user ? (
          <li>
            <Link to="/authForm" className={`navbar-item ${location.pathname === '/authForm' ? 'active' : ''}`}>Sign in</Link>
          </li>
        ) : (
          <>
            <li>
              <Link to="/profil" className={`navbar-item ${location.pathname === '/profil' ? 'active' : ''}`}>Profil</Link>
            </li>
            <li>
              <button onClick={handleLogoutClick} className={`navbar-item logout-button ${location.pathname === '/logout' ? 'active' : ''}`}>Sign out</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;