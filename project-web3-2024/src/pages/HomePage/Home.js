import React from 'react';
import WelcomeBlock from './WelcomeBlock/WelcomeBlock';
import Test from './CarouselMuscle/CarouselMuscles';
import Divider from './Divider/Divider';
import Anchor from '../Anchor/Anchor';
import BMICalculator from './BMI/Bmi';


function Home() {
  return (
    <>
      {/* Bloc de bienvenue */}
      <WelcomeBlock />

       {/* Ligne avec le texte centré */}
       <Divider type="line" text="BODY MASS INDEX" />

      <BMICalculator />

      {/* Ligne défilante avec messages de motivation */}
      <Divider type="scrolling" />

      {/* Carousel des muscles */}
      <Test />
    
      <div className="anchor-section">
        <Anchor />
      </div>
    </>
  );
}

export default Home;