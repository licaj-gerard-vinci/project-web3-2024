import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import WelcomeBlock from './WelcomeBlock/WelcomeBlock';
import MuscleCarousel from './CarouselMuscle/CarouselMuscles';
import Divider from './Divider/Divider';
import Anchor from '../Anchor/Anchor';
import fitnessGif from './../../assets/loading.gif';
import BMICalculator from './BMI/Bmi';
import './Home.css';

function Home() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Délai pour simuler le chargement complet de la page
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000); // 3000 ms = 3 secondes

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!isReady ? (
        <div className="loading-screen">
          <img src={fitnessGif} alt="Loading animation" className="loading-gif"/>
        </div>
      ) : (
        <CSSTransition
          in={isReady}
          timeout={500} // Temps pour l'animation
          classNames="fade"
          appear
        >
          <div>
            {/* Bloc de bienvenue */}
            <WelcomeBlock />

            

            

            {/* Ligne défilante avec messages de motivation */}
            <Divider type="scrolling" />

            {/* Carousel des muscles */}
            <MuscleCarousel />

            {/* Ligne avec le texte centré */}
            <Divider type="line" text="BODY MASS INDEX" />
            <BMICalculator />

            <div className="anchor-section">
              <Anchor />
            </div>
          </div>
        </CSSTransition>
      )}
    </>
  );
}

export default Home;
