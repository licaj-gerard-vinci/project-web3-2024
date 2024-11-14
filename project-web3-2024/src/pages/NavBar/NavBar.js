import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import './Navbar.css';
import ImageDisplay from '../../components/Image/ImageDisplay';

function Navbar({ user, handleLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const loadProfileImage = async () => {
      if (user && user.photoURL) {
        setProfileImage(user.photoURL);
      } else {
        const defaultImageRef = storageRef(storage, 'HomePage/NavBar/default-pp.png');
        const url = await getDownloadURL(defaultImageRef);
        setProfileImage(url);
      }
    };
    loadProfileImage();
  }, [user]);

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <ImageDisplay imagePath="HomePage/logoM.png" />
        </Link>
      </div>
      
      {/* Section centrée pour les liens Home et BodyMap */}
      <div className="navbar-center-links">
        <ul>
          <li>
            <Link to="/" className={`navbar-item ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/bodyMap" className={`navbar-item ${location.pathname === '/bodyMap' ? 'active' : ''}`}>
              BodyMap
            </Link>
          </li>
        </ul>
      </div>

      {/* Section à droite pour les éléments conditionnels */}
      <div className="navbar-right-links">
        <ul>
          {user ? (
            <li>
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <div className="profile-photo-container">
                    <img
                      src={profileImage || '/path/to/default-image.png'}
                      alt="Profile"
                      className="profile-photo"
                    />
                  </div>
                </DropdownMenu.Trigger>

                <DropdownMenu.Content
                  className="dropdown-content"
                  align="end"
                  sideOffset={5}
                >
                  <DropdownMenu.Item
                    className="dropdown-item"
                    onClick={() => navigate('/profil')}
                  >
                    Profile
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="dropdown-item"
                    onClick={handleLogoutClick}
                  >
                    Sign out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            </li>
          ) : (
            <li>
              <Link to="/authForm" className={`navbar-item ${location.pathname === '/authForm' ? 'active' : ''}`}>
                Sign in
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
