import React from 'react';
import ExerciseCard from './ExerciseCard';

const ExerciseList = ({ exercises, user, toggleDescription, handleLike, isLikedByUser, getLikeCount, showDescription }) => {
  return (
    <div className="exercise-list">
      {exercises.length > 0 ? (
        exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            user={user}
            toggleDescription={toggleDescription}
            handleLike={handleLike}
            isLikedByUser={isLikedByUser}
            getLikeCount={getLikeCount}
            showDescription={showDescription}
          />
        ))
      ) : (
        <p>No exercises found for this muscle.</p>
      )}
    </div>
  );
};

export default ExerciseList;
