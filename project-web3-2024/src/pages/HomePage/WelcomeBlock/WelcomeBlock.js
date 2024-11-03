import React, { useState, useEffect } from 'react';
import './WelcomeBlock.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import { auth, db } from '../../../firebaseConfig'; // Importez l'authentification et la base de données Firebase
import { ref, get, set, update } from 'firebase/database';
import ImageCarousel from '../../../components/Image/ImageCarousel';

const WelcomeBlock = () => {
  const [user, setUser] = useState(null);
  const [consecutiveLogins, setConsecutiveLogins] = useState(0);
  const [prenom, setprenom] = useState("");
 

  useEffect(() => {
    // Écoute les changements d'état de l'utilisateur
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        await handleConsecutiveLogins(currentUser.uid); // Gère les connexions consécutives
      }
    });
    return () => unsubscribe();
  }, []);

  // Fonction pour gérer les connexions consécutives
  const handleConsecutiveLogins = async (uid) => {
    const userRef = ref(db, `users/${uid}`);
    const today = new Date().toISOString().split('T')[0]; // Date actuelle au format "YYYY-MM-DD"

    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const lastLoginDate = userData.lastLoginDate;
        const prenom = userData.prenom;
        setprenom(prenom);

        if (isYesterday(lastLoginDate)) {
          // Si la dernière connexion est la veille, incrémentez le compteur
          const newConsecutiveLogins = (userData.consecutiveLogins || 0) + 1;
          setConsecutiveLogins(newConsecutiveLogins);
          await update(userRef, {
            consecutiveLogins: newConsecutiveLogins,
            lastLoginDate: today,
          });
        } else if (lastLoginDate !== today) {
          // Si la connexion n'est pas consécutive, réinitialisez le compteur
          setConsecutiveLogins(1);
          await update(userRef, {
            consecutiveLogins: 1,
            lastLoginDate: today,
          });
        } else {
          // Si l'utilisateur s'est connecté le même jour, ne rien faire
          setConsecutiveLogins(userData.consecutiveLogins);
        }
      } else {
        // Si l'utilisateur n'existe pas dans la base de données, créez un enregistrement initial
        setConsecutiveLogins(1);
        await set(userRef, {
          consecutiveLogins: 1,
          lastLoginDate: today,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la gestion des connexions consécutives :", error);
    }
  };

  // Fonction pour vérifier si une date est celle d'hier
  const isYesterday = (date) => {
    try {
      if (!date || typeof date !== 'string') {
        throw new Error("Date invalide ou absente");
      }
  
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
  
      // Convertir la date fournie en objet Date
      const providedDate = new Date(date);
      if (isNaN(providedDate.getTime())) {
        throw new Error("Date non valide");
      }
  
      // Comparez les dates au format "YYYY-MM-DD"
      return providedDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0];
    } catch (error) {
      console.error("Erreur dans la fonction isYesterday:", error.message);
      return false;
    }
  };
  return (
    <div className="hero-container">
      <div className="hero-content">
        {/* Texte à gauche */}
        <div className="hero-text-wrapper">
          <div className="hero-text-container">
            {user ? ( // Si l'utilisateur est connecté, afficher un message de bienvenue avec le compteur de connexions consécutives
              <>
                <h1 className="hero-heading">De retour parmi nous {prenom}!</h1>
                <p>Connexions consécutives : {consecutiveLogins}</p>
              </>
            ) : (
              <>
                <h1 className="hero-heading">
                  IGNITE <br />
                  <span className="highlight">TRANSFORMATION</span>
                </h1>
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
  );
};

export default WelcomeBlock;
