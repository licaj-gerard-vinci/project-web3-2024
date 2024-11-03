import React, { useState } from 'react';
import './BodyMap.css';
import { ReactComponent as BodyImage } from '../../assets/body.svg'; // Assurez-vous de la bonne importation du SVG

const BodyMap = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  const handleMuscleClick = (e) => {
    const muscle = e.target.id; // Récupère l'ID de la partie cliquée
    setSelectedMuscle(muscle); // Définit l'état du muscle sélectionné
  };

  return (
    <div className="body-map">
      <BodyImage onClick={handleMuscleClick} className="svg-body" />
      
      {/* Affichage des informations sur le muscle sélectionné */}
      {selectedMuscle && (
        <div className="muscle-info">
          <h2>{selectedMuscle}</h2>
          <p>Informations sur le muscle {selectedMuscle}...</p>
        </div>
      )}
    </div>
  );
};

export default BodyMap;