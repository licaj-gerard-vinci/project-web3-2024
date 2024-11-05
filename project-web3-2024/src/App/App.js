import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from '../pages/HomePage/Home';
import BodyMap from '../pages/Muscle/BodyMap';
import Exemple from '../pages/Exemple';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Login from '../pages/Auth/Login/login';
import { signOut } from 'firebase/auth';
import Register from '../pages/Auth/Register/register';
import ImageDisplay from '../components/Image/ImageDisplay';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        console.log("User signed out");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  return (
    <Router>
      <div className="homepage">
        {/* Navbar with conditional rendering */}
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
              <li><button onClick={handleLogout} className="logout-button">Déconnexion</button></li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bodyMap" element={<BodyMap />} />
          <Route path="/exemple" element={<Exemple />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;