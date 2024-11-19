import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';  // Import the login component
import { onAuthStateChanged } from 'firebase/auth'; // Firebase auth import
import { auth } from './firebase';  // Firebase configuration import

function App() {
  const [user, setUser] = useState(null);

  // Vérifier l'état de connexion de l'utilisateur via Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();  // Clean up the subscription when the component unmounts
  }, []);

  return (
    <Router>
      <div className="homepage">
        <nav className="navbar">
          <div className="navbar-logo">
            <h1>Muscle Hub</h1>
          </div>
          <ul className="navbar-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/login">Connection</Link></li> {/* Lien pour la page de connexion */}
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />  {/* Page de connexion */}
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
