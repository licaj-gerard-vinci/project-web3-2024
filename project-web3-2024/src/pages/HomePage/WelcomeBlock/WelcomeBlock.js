import React from 'react';
import './WelcomeBlock.css';
import '../Home.css';

const WelComeBlock = () => {
  return (
    <div className="hero-container">
      <div className="container-overlay">
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
        <div className="hero-image-container">
          <img
            src="path_to_your_image.jpg" // Remplace par le chemin correct de ton image
            alt="Gym Fitness"
            className="hero-image"
          />
        </div>
      </div>
    </div>
  );
};

export default WelComeBlock;
