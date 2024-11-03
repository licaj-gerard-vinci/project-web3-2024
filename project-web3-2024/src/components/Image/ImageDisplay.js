// src/components/ImageDisplay.js
import React, { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const ImageDisplay = ({ imagePath, altText = "Image" }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImageUrl = async () => {
      const storage = getStorage();
      const imageRef = ref(storage, imagePath);

      try {
        const url = await getDownloadURL(imageRef);
        setImageUrl(url);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'image :", err);
        setError(true);
      }
    };

    fetchImageUrl();
  }, [imagePath]);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="image-container" style={{ textAlign: 'center' }}>
      {!isLoaded && !error && <p>Chargement de l'image...</p>}
      {error ? (
        <p>Impossible de charger l'image</p>
      ) : (
        imageUrl && (
          <img
            src={imageUrl}
            alt={altText}
            onLoad={handleImageLoad}
            style={{ display: isLoaded ? 'block' : 'none', maxWidth: '100%' }}
          />
        )
      )}
    </div>
  );
};

export default ImageDisplay;
