import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from '../pages/HomePage/Home';
import BodyMap from '../pages/Muscle/BodyMap';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { db } from '../firebaseConfig';
import Footer from '../pages/Footer/Footer';
import Navbar from '../pages/NavBar/NavBar';
import Profil from '../pages/ProfilPage/Profil';
import AuthForm from '../pages/Auth/AuthForm/AuthFrom';
import TermsOfUse from '../pages/TermsOfUse/termsOfUse';
import { Navigate } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserData(currentUser.uid); // Récupère les données utilisateur au démarrage
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      setUser((prevUser) => ({
        ...prevUser,
        ...snapshot.val(),
      }));
    }
  };

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

  const ScrollWrapper = ({ children }) => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return children;
  };

  return (
    <Router>
      <ScrollWrapper>
        <div className="homepage">
          <Navbar user={user} handleLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bodyMap" element={<BodyMap />} />
            <Route path="/authForm" element={<AuthForm />} />
            <Route
              path="/profil"
              element={
                user ? (
                  <Profil user={user} onUserUpdate={() => fetchUserData(user.uid)} />
                ) : (
                  <Navigate to="/authForm" state={{ fromProtected: true }} />
                )
              }
            />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
          </Routes>
        </div>
        <Footer />
      </ScrollWrapper>
    </Router>
  );
}

export default App;
