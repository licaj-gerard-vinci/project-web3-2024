import React, { useState } from 'react';
import './BodyMap.css';
import { ReactComponent as BodyFront } from '../../assets/body.svg';
import { ReactComponent as BodyBack } from '../../assets/bodyBack.svg';

const BodyMap = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [isFrontView, setIsFrontView] = useState(true);

  const handleMuscleClick = (e) => {
    const muscle = e.target.id;
    setSelectedMuscle(muscle);
  };

  const toggleView = () => {
    setIsFrontView((prevView) => !prevView);
  };

  return (
    <div className="main-container">
      {/* Left Column: Body Map */}
      <div className="body-map-container">
        {/* SVG for Front View */}
        <div className={`svg-body front-view ${isFrontView ? '' : 'hide-front'}`}>
          <BodyFront onClick={handleMuscleClick} />
        </div>

        {/* SVG for Back View */}
        <div className={`svg-body back-view ${!isFrontView ? 'show-back' : ''}`}>
          <BodyBack onClick={handleMuscleClick} />
        </div>

        {/* Toggle Button below body map */}
        <button className="toggle-button" onClick={toggleView}>
          {isFrontView ? 'Switch to Back View' : 'Switch to Front View'}
        </button>
      </div>

      {/* Right Column: Exercise List and Videos */}
      <div className="exercise-list-container">
        {selectedMuscle ? (
          <>
            <h2>{selectedMuscle}</h2>
            <p>List of exercises for {selectedMuscle}:</p>
            <ul>
              <li>Exercise 1</li>
              <li>Exercise 2</li>
              <li>Exercise 3</li>
              <li>More exercises...</li>
            </ul>
            <p>Video tutorials:</p>
            <ul>
              <li>Video 1</li>
              <li>Video 2</li>
            </ul>
          </>
        ) : (
          <p>Select a muscle to see exercises and videos.</p>
        )}
      </div>
    </div>
  );
};

export default BodyMap;