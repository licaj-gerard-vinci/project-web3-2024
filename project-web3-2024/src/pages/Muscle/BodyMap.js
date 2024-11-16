import React, { useState, useEffect } from 'react';
import './BodyMap.css';
import { ReactComponent as BodyFront } from '../../assets/body.svg';
import { ReactComponent as BodyBack } from '../../assets/bodyBack.svg';
import { ref, get, getDatabase, onValue, set, remove } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AiFillMinusCircle } from "react-icons/ai";
import { MdOutlineMoreVert } from "react-icons/md";
import VideosPlayer from './VideosPlayer/VideosPlayer';
import { IoHeartOutline } from "react-icons/io5";
import { IoHeartSharp } from "react-icons/io5";
import ExerciseForm from './ExerciseForm/ExerciseForm';
import { AiFillPlusCircle } from "react-icons/ai";


const BodyMap = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [isFrontView, setIsFrontView] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [showDescription, setShowDescription] = useState({}); // état pour gérer l'affichage des descriptions
  const [likes, setLikes] = useState({}); // État pour stocker les likes en temps réel
  const [showAllExercises, setShowAllExercises] = useState(false);
  const [allExercises, setAllExercises] = useState([]);
  const [muscles, setCategories] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const auth = getAuth();
  const db = getDatabase();

  useEffect(() => {
    // Charger les catégories depuis Firebase
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // Chemin vers le rôle de l'utilisateur dans la base de données
        const userRef = ref(db, `users/${user.uid}/isAdmin`);

        // Récupérer le rôle de l'utilisateur dans la base de données
        onValue(userRef, (snapshot) => {
          const role = snapshot.val();
          setIsAdmin(role === true);
        });
      } else {
        // Si l'utilisateur n'est pas connecté, il n'est pas admin
        setIsAdmin(false);        
      }
    });
  }, [db, auth]);
  console.log(isAdmin);
  
  useEffect(() => {
    if (user) {
      const likesRef = ref(db, "likes");
      onValue(likesRef, (snapshot) => {
        const data = snapshot.val() || {};
        setLikes(data);
      });
    }
  }, [user, db]);

  const handleMuscleClick = (e) => {
    const muscle = e.target.id;
    setSelectedMuscle(muscle);
    toggleExercises(muscle);
  };

  const deleteExercise = async (exerciseId) => {
    try {
        await remove(ref(db, `exercises/${exerciseId}`));
        setAllExercises((prevExercises) =>
            prevExercises.filter((exercise) => exercise.id !== exerciseId)
        );
        console.log(`Exercice ${exerciseId} supprimé.`);
    } catch (error) {
        console.error("Erreur lors de la suppression de l'exercice :", error);
    }
};


  const fetchAllExercises = async () => {
    const exercisesRef = ref(db, 'exercises');
    try {
        const snapshot = await get(exercisesRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            const exercisesList = Object.keys(data).map((key) => ({
                id: key,
                ...data[key],
            }));
            setAllExercises(exercisesList);
        } else {
            setAllExercises([]);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des exercices :", error);
    }
};


  const toggleExercises = async (selectedMuscle) => {
    const exercisesRef = ref(db, 'exercises');
  
    try {
      const snapshot = await get(exercisesRef);
      if (snapshot.exists()) {
        const allExercises = snapshot.val();
        const filteredExercises = [];
  
        Object.keys(allExercises).forEach((exerciseId) => {
          const exercise = allExercises[exerciseId];
          if (exercise.muscles && exercise.muscles.includes(selectedMuscle)) {
            filteredExercises.push({
              id: exerciseId,
              name: exercise.name,
              description: exercise.description,
              url: exercise.url,
              difficulty: exercise.difficulty
            });
          }
        });
  
        setExercises(filteredExercises); // Met à jour l'état avec les exercices filtrés
      } else {
        console.log("Aucun exercice trouvé");
        setExercises([]); // Réinitialise la liste si aucun exercice trouvé
      }
    } catch (error) {
      console.error(error);
      setExercises([]); // Réinitialise la liste en cas d'erreur
    }
  };
  

  const toggleView = () => {
    setIsFrontView((prevView) => !prevView);
  };
  
  const toggleDescription = (id) => {
    setShowDescription((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  const handleToggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

const handleLike = (exerciseId) => {
  if (!user) {
    alert("Veuillez vous connecter pour aimer cet exercice.");
    return;
  }
  
  

  const likeRef = ref(db, `likes/${exerciseId}/${user.uid}`);

  if (likes[exerciseId] && likes[exerciseId][user.uid]) {
    remove(likeRef); // Supprime le like si l'utilisateur a déjà liké cet exercice
  } else {
    set(likeRef, true); // Ajoute un like pour cet exercice
  }
};

const isLikedByUser = (exerciseId) => likes[exerciseId] && likes[exerciseId][user?.uid];
const getLikeCount = (exerciseId) => likes[exerciseId] ? Object.keys(likes[exerciseId]).length : 0;

  
  return (
    <div className="main-container">
      <div className="body-map-container">
      <div>
        <ExerciseForm showForm={showForm} handleToggleForm={handleToggleForm}/>
      </div>
        <div className={`svg-body front-view ${isFrontView ? '' : 'hide-front'}`}>
          <BodyFront onClick={handleMuscleClick} />
        </div>
        <div className={`svg-body back-view ${!isFrontView ? 'show-back' : ''}`}>
          <BodyBack onClick={handleMuscleClick} />
        </div>
        <button className="toggle-button" onClick={toggleView}>
          {isFrontView ? 'Switch to Back View' : 'Switch to Front View'}
        </button>
      </div>

      <div className="exercise-list-container">
        <div>
          {isAdmin && !showForm && (
            <button className="fixed-button" onClick={handleToggleForm}>
              <AiFillPlusCircle />
            </button>
          )}
          {isAdmin && (
            <button className="fixed-button" onClick={() => {
                setShowAllExercises((prev) => !prev);
                if (!showAllExercises) fetchAllExercises();
            }}>
                <AiFillMinusCircle />
            </button>
          )}
          {showAllExercises && (
            <div className="exercise-list">
                <h2>Tous les Exercices</h2>
                {allExercises.length > 0 ? (
                    allExercises.map((exercise) => (
                        <div key={exercise.id} className="exercise-card">
                            <h3>{exercise.name}</h3>
                            <p>Description: {exercise.description}</p>
                            <p>Difficulty: {exercise.difficulty}</p>
                            <button
                                onClick={() => deleteExercise(exercise.id)}
                                className="delete-button"
                            >
                                Supprimer
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Aucun exercice trouvé.</p>
                )}
            </div>
          )}

        </div>
        {selectedMuscle ? (
          <>
            <h2>{selectedMuscle}</h2>
            {!user &&( 
              <div className='div'>Log in to view exercises</div>
            )}
            {user && (
              <p>List of exercises for {selectedMuscle}:</p>
            )}
            {user && (
              <div className="exercise-list">
              {exercises.length > 0 ? (
                exercises.map(exercise => (
                  <div key={exercise.id} className="exercise-card">
                    <h3>{exercise.name}</h3>
                    <VideosPlayer videoUrl={exercise.url} videoId={exercise.id}/>
                    {/* Bouton Like */}
                    <button className="likes-button" onClick={() => handleLike(exercise.id)}>
                      {isLikedByUser(exercise.id) ? <IoHeartSharp style={{ color: 'red' }} /> : <IoHeartOutline />}
                    </button>
                    <div className='like-count'>{getLikeCount(exercise.id)} </div> {/* Compteur de likes */}
                    <button className="details-button" onClick={() => toggleDescription(exercise.id)}>
                      {showDescription[exercise.id] ?  <MdOutlineMoreVert/> : <MdOutlineMoreVert />}
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
                <p>No exercises found for this muscle.</p>
              )}
            </div>
            )} 
          </>
        ) : (
          <p>Select a muscle to see exercises and videos.</p>
        )}
      </div>

      <style>{`
        .svg-body path[id="${selectedMuscle}"] {
          fill: rgba(255, 85, 0.8);
          stroke: rgb(255, 85, 0);
        }
      `}</style>
    </div>
    
  );
};

export default BodyMap;