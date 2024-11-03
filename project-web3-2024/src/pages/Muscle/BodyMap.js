import React, { useState } from 'react';
import './BodyMap.css';
import { ReactComponent as BodyFront } from '../../assets/body.svg';
import { ReactComponent as BodyBack } from '../../assets/bodyBack.svg';

const BodyMap = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  const handleMuscleClick = (e) => {
    const muscle = e.target.id;
    setSelectedMuscle(muscle);
  };

  return (
    <div className="body-map">
      <BodyFront onClick={handleMuscleClick} className="svg-body" />
      <BodyBack onClick={handleMuscleClick} className="svg-body" />
      
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
