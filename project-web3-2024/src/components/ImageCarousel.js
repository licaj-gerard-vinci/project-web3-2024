// src/components/ImageCarousel.js
import React, { useState, useEffect } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Importer les styles du carousel

const ImageCarousel = ({ folderPath }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      const storage = getStorage();
      const folderRef = ref(storage, folderPath);

      try {
        const result = await listAll(folderRef);
        const urlPromises = result.items.map((itemRef) => getDownloadURL(itemRef));
        const urls = await Promise.all(urlPromises);
        setImageUrls(urls);
      } catch (err) {
        console.error("Erreur lors de la récupération des images :", err);
        setError("Erreur lors de la récupération des images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [folderPath]);

  if (loading) return <p>Chargement des images...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="carousel-container">
      <Carousel
        showThumbs={false}
        infiniteLoop
        showIndicators={false}
        autoPlay
        interval={3000}
        showArrows={false}
        showStatus={false}
      >
        {imageUrls.map((url, index) => (
          <div key={index}>
            <img src={url} alt={`Image ${index + 1}`} style={{ maxWidth: '70%' }} />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
