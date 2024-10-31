import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from '../pages/HomePage/Home';
import About from '../pages/About'; // Adjust paths based on your structure
import Exemple from '../pages/Exemple'; // Adjust paths based on your structure
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import logoM from '../assets/logoM.png';
import { auth } from '../pages/Login/firebase';
import { onAuthStateChanged } from 'firebase/auth'; // Firebase auth import
import Login from '../pages/Login/login'  // Import the login component
import { signOut } from 'firebase/auth';






function App() {
  const [user, setUser] = useState(null);

  // Vérifier l'état de connexion de l'utilisateur via Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();  // Clean up the subscription when the component unmounts
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null); // Met à jour l'état pour déconnecter l'utilisateur
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };


  

  return (
    <Router>
      <div className="homepage">
        {/* Social Bar */}
        <div className="social-bar">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        </div>

        {/* Navbar with conditional rendering */}
        <nav className="navbar">
          <div className="navbar-logo">
            <img src={logoM} alt="GYMFITO Logo" />
          </div>
          <ul className="navbar-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/exemple">Exemple</Link></li>
            {!user ? (
              <li><Link to="/login">Connection</Link></li>
            ) : (
              <li><button onClick={handleLogout} className="logout-button">Déconnexion</button></li>
            )}
          </ul>
          
        </nav>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/exemple" element={<Exemple />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

/* "<button className="join-now-btn">Join Now</button>"*/

export default App;
