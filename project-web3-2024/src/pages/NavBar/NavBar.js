// NavBar.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ImageDisplay from '../../components/Image/ImageDisplay';
import './Navbar.css';

function Navbar({ user, handleLogout }) {
  const [isEmailVerified, setIsEmailVerified] = useState(user?.emailVerified || false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkEmailVerification = async () => {
      if (user && !user.emailVerified) {
        await user.reload();
        if (!user.emailVerified) {
          navigate('/register');
        } else {
          setIsEmailVerified(true);
        }
      }
    };

    checkEmailVerification();
  }, [user, location, navigate]);

  useEffect(() => {
    if (user && !user.emailVerified) {
      const interval = setInterval(async () => {
        await user.reload();
        if (user.emailVerified) {
          setIsEmailVerified(true);
          clearInterval(interval);
        } else {
          setIsEmailVerified(false);
        }
      }, 1000);
      return () => clearInterval(interval);
    } else if (user && user.emailVerified) {
      setIsEmailVerified(true);
    }
  }, [user, navigate]);

  const handleLogoutClick = () => {
    handleLogout();
    setIsEmailVerified(false);
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