// CarouselMuscles.js
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import './CarouselMuscles.css'; // Custom CSS for the carousel

// Sample muscle group images (replace with actual images)
import chestImage from '../../../assets/image2.jpg';
import backImage from '../../../assets/image2.jpg';
import armsImage from '../../../assets/image2.jpg';
import legsImage from '../../../assets/image2.jpg';
import shouldersImage from '../../../assets/image2.jpg';

const MuscleCarousel = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: false, // Animation happens only once
      offset: 100, // Offset from the trigger point
    });
  }, []);

  const muscleGroups = [
    { name: 'Chest', image: chestImage },
    { name: 'Back', image: backImage },
    { name: 'Arms', image: armsImage },
    { name: 'Legs', image: legsImage },
    { name: 'Shoulders', image: shouldersImage },
  ];

  return (
    <div className="muscle-carousel-container">
      <h2 data-aos="fade-up" className="carousel-title">Focus on Every Muscle for Maximum Gains 💥</h2>
      <Carousel
        showThumbs={false}
        showArrows={true}
        showStatus={false}
        showIndicators={false}  // Hide dots
        centerMode={true}
        centerSlidePercentage={33.33} // Show 3 slides at a time
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
      >
        {muscleGroups.map((muscle, index) => (
          <div key={index} className="muscle-slide" data-aos="fade-up" data-aos-delay={index * 100}>
            <img src={muscle.image} alt={muscle.name} className="muscle-image" style={{ maxWidth: '60%' }} />
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