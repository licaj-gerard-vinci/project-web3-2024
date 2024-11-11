// src/components/CarouselMuscles.js
import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import './CarouselMuscles.css';

const MuscleCarousel = ({ folderPath = 'HomePage/MuscleCarousel' }) => {
  const [muscleImages, setMuscleImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const customNames = {
    'Chest.webp': 'Chest',
    'abdos.jpg': 'Abs',
    'bicep.webp': 'Biceps',
    'dos.jpg': 'Back',
    'epaules.jpg': 'Shoulders',
    'jambes.jpg': 'Legs'
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      const storage = getStorage();
      const folderRef = ref(storage, folderPath);
      const uniqueImages = new Map();

      try {
        const result = await listAll(folderRef);
        const imagePromises = result.items.map((itemRef) =>
          getDownloadURL(itemRef).then((url) => {
            const fileName = itemRef.name;
            const displayName = customNames[fileName] || fileName.replace(/\.[^/.]+$/, "");

            if (!uniqueImages.has(displayName)) {
              uniqueImages.set(displayName, { url, name: displayName });
            }
          })
        );

        await Promise.all(imagePromises);
        setMuscleImages(Array.from(uniqueImages.values()));
      } catch (err) {
        console.error("Erreur lors de la récupération des images :", err);
        setError("Erreur lors de la récupération des images. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [folderPath]);

  if (loading) return <p>Chargement des images...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="muscle-carousel-container" data-aos="fade-up">
      <h2 className="carousel-title">Focus on Every Muscle for Maximum Gains 💥</h2>
      <Carousel
        showThumbs={false}
        showArrows
        showStatus={false}
        showIndicators={true}
        centerMode
        centerSlidePercentage={33.33}
        infiniteLoop
        autoPlay
        interval={3500}
        stopOnHover={false}
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
        {muscleImages.map((muscle, index) => (
          <div key={index} className="muscle-slide" data-aos="fade-up" data-aos-delay={index * 100}>
            <img src={muscle.url} alt={muscle.name} className="muscle-image" />
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