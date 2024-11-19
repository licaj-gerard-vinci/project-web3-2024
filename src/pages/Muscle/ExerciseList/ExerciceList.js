import './ExerciceList.css'
import VideosPlayer from '../VideosPlayer/VideosPlayer';
import { ref, set, remove, getDatabase, onValue } from "firebase/database";
import { IoHeartOutline } from "react-icons/io5";
import { IoHeartSharp } from "react-icons/io5";
import { MdOutlineMoreVert } from "react-icons/md";
import React, { useEffect, useState, useCallback } from 'react';




const ExerciceList = ( {exercises, user} ) => {
  const [showDescription, setShowDescription] = useState({});
  const [likes, setLikes] = useState({});
  const [sortedExercises, setSortedExercises] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [filterByLikes, setFilterByLikes] = useState(false);
  const isLikedByUser = (exerciseId) => likes[exerciseId] && likes[exerciseId][user?.uid];
  const getLikeCount = useCallback(
    (exerciseId) => (likes[exerciseId] ? Object.keys(likes[exerciseId]).length : 0),[likes]
  );
  const db = getDatabase();


  useEffect(() => {
    if (user) {
      const likesRef = ref(db, "likes");
      onValue(likesRef, (snapshot) => {
        const data = snapshot.val() || {};
        setLikes(data);
      });
    }
  }, [user, db]);
  useEffect(() => {
    let filteredExercises = [...exercises];

    if (selectedDifficulty) {
      filteredExercises = filteredExercises.filter(
        (exercise) => exercise.difficulty === selectedDifficulty
      );
    }
    if (filterByLikes && user) {
      filteredExercises = filteredExercises.filter((exercise) =>
        isLikedByUser(exercise.id)
      );
    }

    filteredExercises.sort((a, b) => {
      const likesA = getLikeCount(a.id);
      const likesB = getLikeCount(b.id);
      return sortOrder === "asc" ? likesA - likesB : likesB - likesA;
    });

    setSortedExercises(filteredExercises);
  }, [exercises, sortOrder, selectedDifficulty, filterByLikes, likes, getLikeCount, user]);

  const toggleDescription = (id) => {
    setShowDescription((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const handleLike = (exerciseId) => {
    if (!user) {
      alert("Veuillez vous connecter pour aimer cet exercice.");
      return;
    }
    const likeRef = ref(db, `likes/${exerciseId}/${user.uid}`);
  
    if (likes[exerciseId] && likes[exerciseId][user.uid]) {
      remove(likeRef); 
    } else {
      set(likeRef, true);
    }
  };

  return (
    <div className="exercise-container">
      <div className="filter-sort-container">
        <label htmlFor="difficulty">Filter by Difficulty:</label>
        <select
          id="difficulty"
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="">All</option>
          <option value="Easy">Easy</option>
          <option value="average">Average</option>
          <option value="difficult">Difficult</option>
        </select>

        <label htmlFor="sortOrder">Sort by Likes:</label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={filterByLikes}
            onChange={(e) => setFilterByLikes(e.target.checked)}
          />
          Favorites
        </label>
      </div>

      <div className="exercise-list">
        {sortedExercises.length > 0 ? (
          sortedExercises.map((exercise) => (
            <div key={exercise.id} className="exercise-card">
              <h3>{exercise.name}</h3>
              <VideosPlayer videoUrl={exercise.url} videoId={exercise.id} />
              <button className="likes-button" onClick={() => handleLike(exercise.id)}>
                {isLikedByUser(exercise.id) ? (
                  <IoHeartSharp style={{ color: "red" }} />
                ) : (
                  <IoHeartOutline />
                )}
              </button>
              <div className="like-count">{getLikeCount(exercise.id)} </div>
              <button
                className="details-button"
                onClick={() => toggleDescription(exercise.id)}
              >
                <MdOutlineMoreVert />
              </button>
              {showDescription[exercise.id] && (
                <div className="details">
                  <p>Description: {exercise.description}</p>
                  <p>Difficulty: {exercise.difficulty}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No exercises found for this filter.</p>
        )}
      </div>
    </div>

  )
}

export default ExerciceList;