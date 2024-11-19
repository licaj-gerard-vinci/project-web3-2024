import React, { useState, useEffect, useRef } from 'react';
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
  const transitionRef = useRef(null); // Create a ref for the transitioning element

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000); // 3000 ms = 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!isReady ? (
        <div className="loading-screen">
          <img src={fitnessGif} alt="Loading animation" className="loading-gif" />
        </div>
      ) : (
        <CSSTransition
          in={isReady}
          timeout={500} // Animation duration
          classNames="fade"
          appear
          nodeRef={transitionRef} // Attach the ref to CSSTransition
        >
          <div ref={transitionRef}> {/* Attach the same ref to the transitioning element */}
            {/* Welcome block */}
            <WelcomeBlock />

            {/* Centered text line */}
            <Divider type="line" text="BODY MASS INDEX" />
            <BMICalculator />

            {/* Scrolling motivational messages */}
            <Divider type="scrolling" />

            {/* Muscle carousel */}
            <MuscleCarousel />

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
