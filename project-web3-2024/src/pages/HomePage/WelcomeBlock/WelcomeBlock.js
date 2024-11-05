// WelcomeBlock.js
import React, { useState, useEffect } from 'react';
import './WelcomeBlock.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { auth, db } from '../../../firebaseConfig';
import { ref, get, set, update } from 'firebase/database';
import ImageCarousel from '../../../components/Image/ImageCarousel';
import { FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const WelcomeBlock = () => {
  const [user, setUser] = useState(null);
  const [consecutiveLogins, setConsecutiveLogins] = useState(0);
  const [prenom, setprenom] = useState("");
  const [showIcons, setShowIcons] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 100; // Scroll distance in pixels before hiding icons
      setShowIcons(window.scrollY < scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await handleConsecutiveLogins(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleConsecutiveLogins = async (uid) => {
    const userRef = ref(db, `users/${uid}`);
    const today = new Date().toISOString().split('T')[0];

    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const lastLoginDate = userData.lastLoginDate;
        const prenom = userData.prenom;
        setprenom(prenom);

        if (isYesterday(lastLoginDate)) {
          const newConsecutiveLogins = (userData.consecutiveLogins || 0) + 1;
          setConsecutiveLogins(newConsecutiveLogins);
          await update(userRef, { consecutiveLogins: newConsecutiveLogins, lastLoginDate: today });
        } else if (lastLoginDate !== today) {
          setConsecutiveLogins(1);
          await update(userRef, { consecutiveLogins: 1, lastLoginDate: today });
        } else {
          setConsecutiveLogins(userData.consecutiveLogins);
        }
      } else {
        setConsecutiveLogins(1);
        await set(userRef, { consecutiveLogins: 1, lastLoginDate: today });
      }
    } catch (error) {
      console.error("Erreur lors de la gestion des connexions consécutives :", error);
    }
  };

  const isYesterday = (date) => {
    try {
      if (!date || typeof date !== 'string') throw new Error("Date invalide ou absente");

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const providedDate = new Date(date);

      if (isNaN(providedDate.getTime())) throw new Error("Date non valide");

      return providedDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0];
    } catch (error) {
      console.error("Erreur dans la fonction isYesterday:", error.message);
      return false;
    }
  };

  return (
    <>
      {/* Social Bar */}
      <div className={`social-bar ${showIcons ? 'fade-in' : 'fade-out'}`}>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
      </div>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text-wrapper">
            <div className="hero-text-container">
              {user ? (
                <>
                  <h1 className="hero-heading">De retour parmi nous {prenom}!</h1>
                  <p>Connexions consécutives : {consecutiveLogins}</p>
                </>
              ) : (
                <>
                  <h1 className="hero-heading">IGNITE <br /><span className="highlight">TRANSFORMATION</span></h1>
                  <h2 className="hero-subheading">& UNITE YOUR STRENGTH</h2>
                  <p className="hero-description">
                    Discover fitness excellence at our premier gym. With top-notch equipment,
                    expert trainers, and dynamic classes, we're committed to helping you reach
                    your goals. Join us today and unleash your full potential!
                  </p>
                  <button className="hero-btn">JOIN NOW</button>
                </>
              )}
            </div>
          </div>
          <div className="hero-image-container">
            <ImageCarousel folderPath="HomePage/WelcomeBlock" />
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeBlock;