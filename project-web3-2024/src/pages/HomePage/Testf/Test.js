import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import './Test.css'; // Custom CSS for the carousel

// Sample muscle group images (replace with actual images)
import chestImage from '../../../assets/image2.jpg';
import backImage from '../../../assets/image2.jpg';
import armsImage from '../../../assets/image2.jpg';
import legsImage from '../../../assets/image2.jpg';
import shouldersImage from '../../../assets/image2.jpg';

const MuscleCarousel = () => {
  const muscleGroups = [
    { name: 'Chest', image: chestImage },
    { name: 'Back', image: backImage },
    { name: 'Arms', image: armsImage },
    { name: 'Legs', image: legsImage },
    { name: 'Shoulders', image: shouldersImage },
  ];

  return (
    <div className="muscle-carousel-container">
      <h2 className="carousel-title">Different Muscles you can train 💪</h2>
      <Carousel
        showThumbs={false}
        infiniteLoop={true}
        autoPlay={true}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button type="button" onClick={onClickHandler} title={label} className="arrow-prev">
              &#8249;
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button type="button" onClick={onClickHandler} title={label} className="arrow-next">
              &#8250;
            </button>
          )
        }
        interval={2500}
        showArrows={true}
        showStatus={false}
        showIndicators={false}  // Hide dots
        centerMode={true}
        centerSlidePercentage={33.3} // Show 3 slides at a time
      >
        {muscleGroups.map((muscle, index) => (
          <div key={index} className="muscle-slide">
            <img src={muscle.image} alt={muscle.name} className="muscle-image" />
            <div className="muscle-name-overlay">
              <h3>{muscle.name}</h3>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MuscleCarousel;