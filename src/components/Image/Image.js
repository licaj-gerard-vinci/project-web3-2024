// src/components/ImageCarousel.js
import { useState, useEffect } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Image = ({ path }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
    setLoading(true);
    const storage = getStorage();
    const folderRef = ref(storage,path);

    try {
        const result = await listAll(folderRef);
        const urlPromises = result.items.map((itemRef) => getDownloadURL(itemRef));
        const urls = await Promise.all(urlPromises);
        setImageUrls(urls);
    } catch (err) {
        console.error("Error retrieving images :", err);
        setError("Error retrieving images. Please check the folder or try again later.");
    } finally {
        setLoading(false);
    }
};

    fetchImages();
  }, [path]);  

  return { imageUrls, loading, error };
};

export default Image;