import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/HomePage/Home';
import BodyMap from '../pages/Muscle/BodyMap';
import Exemple from '../pages/Exemple';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import AuthForm from '../pages/Auth/AuthForm/AuthFrom';
import { signOut } from 'firebase/auth';
import Footer from '../pages/Footer/Footer';
import Navbar from '../pages/NavBar/NavBar'; // Import the Navbar component
import Profil from '../pages/ProfilPage/Profil';
import TermsOfUse from '../pages/TermsOfUse/termsOfUse';
import { Navigate } from 'react-router-dom';

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
        {/* Navbar component with props */}
        <Navbar user={user} handleLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bodyMap" element={<BodyMap />} />
          <Route path="/authForm" element={<AuthForm />} />
          <Route path="/profil" element={user ? <Profil /> : <Navigate to="/authForm" state={{ fromProtected: true }} />}/>
          <Route path="/terms-of-use" element={<TermsOfUse />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;