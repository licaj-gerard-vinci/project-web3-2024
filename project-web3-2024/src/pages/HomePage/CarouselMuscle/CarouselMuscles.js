import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Pour la navigation
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import useImages from '../../../components/Image/Image';
import './CarouselMuscles.css';

const MuscleCarousel = ({ folderPath = 'HomePage/MuscleCarousel' }) => {
  const navigate = useNavigate();

  const customNames = {
    [`${folderPath}/Chest.webp`]: 'Chest',
    [`${folderPath}/abdos.jpg`]: 'Abs',
    [`${folderPath}/bras.webp`]: 'Biceps',
    [`${folderPath}/dos.jpg`]: 'Back',
    [`${folderPath}/epaules.jpg`]: 'Shoulders',
    [`${folderPath}/jambes.png`]: 'Legs'
  };

  const { imageUrls, loading, error } = useImages({ path: folderPath });

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  if (loading) return <p>Loading images...</p>;
  if (error) return <p>{error}</p>;

  const muscleImages = imageUrls.map((url) => {
    const fileNameWithExtension = decodeURIComponent(url.split('/').pop().slice(0, url.split('/').pop().indexOf('?')));
    const displayName = customNames[fileNameWithExtension] || fileNameWithExtension.replace(/\.[^/.]+$/, "");
    return { url, name: displayName };
  });

  const handleMuscleClick = (muscleName) => {
    navigate('/bodymap', { state: { selectedMuscle: muscleName } }); // Naviguer avec l'état
  };

  return (
    <div className="muscle-carousel-container" data-aos="fade-up">
      <h2 className="carousel-title">Focus on Every Muscle for Maximum Gains 💥</h2>
      <Carousel
        showThumbs={false}
        showArrows
        showStatus={false}
        showIndicators={false}
        centerMode
        centerSlidePercentage={33.33}
        infiniteLoop
        autoPlay
        interval={3500}
        stopOnHover={false}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="arrow-prev"
            >
              &#8249;
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="arrow-next"
            >
              &#8250;
            </button>
          )
        }
      >
        {muscleImages.map((muscle, index) => (
          <div key={index} className="muscle-slide" data-aos="fade-up" data-aos-delay={index * 100}>
            <img src={muscle.url} alt={muscle.name} className="muscle-image" />
            <button
              className="muscle-button"
              onClick={() => handleMuscleClick(muscle.name)}
            >
              {muscle.name}
            </button>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MuscleCarousel;
