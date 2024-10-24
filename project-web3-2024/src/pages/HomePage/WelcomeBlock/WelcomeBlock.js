import React from 'react';
import './WelcomeBlock.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import image1 from '../../../assets/image2.jpg';
import image2 from '../../../assets/image.jpg';
import image3 from '../../../assets/image.jpg';

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
        {/* Carousel à droite */}
        <div className="hero-image-container">
          <Carousel showThumbs={false} infiniteLoop={true} autoPlay={true} interval={2000} showArrows={false} showStatus={false}>
            <div>
              <img src={image1} alt="Slide 1" />
            </div>
            <div>
              <img src={image2} alt="Slide 2" />
            </div>
            <div>
              <img src={image3} alt="Slide 3" />
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default WelComeBlock;