import React, { useState } from 'react';

const VideosPlayer = ({ videoUrl, videoId }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handleVideoClick = () => {
    const videoElement = document.getElementById(`exerciseVideo-${videoId}`);
    if (isPlaying) {
      videoElement.pause();
      videoElement.loop = false;
      setIsPlaying(false);
    } else {
      videoElement.loop = true;  // Activer la boucle
      videoElement.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="video-container">
      <video
        id={`exerciseVideo-${videoId}`} // Utilisation de l'identifiant unique
        src={videoUrl}
        controls={false} // Désactiver les contrôles par défaut
        onClick={handleVideoClick} // Déclencher le clic pour démarrer/arrêter la vidéo
        style={{ cursor: 'pointer', width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default VideosPlayer;
