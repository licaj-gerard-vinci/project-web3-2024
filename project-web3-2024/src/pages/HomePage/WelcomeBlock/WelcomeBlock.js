import React from 'react';
import './WelcomeBlock.css';
import image from '../../../assets/image.jpg'; // Chemin vers l'image

const WelComeBlock = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        {/* Texte à gauche */}
        <div className="hero-text-wrapper">
          <div className="hero-text-container">
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
          </div>
        </div>
        {/* Image à droite */}
        <div className="hero-image-container">
          <div 
            className="hero-image" 
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
            }}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelComeBlock;
