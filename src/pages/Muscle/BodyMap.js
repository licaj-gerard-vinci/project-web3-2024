import React, { useState, useEffect } from 'react';
import './BodyMap.css';
import { ReactComponent as BodyFront } from '../../assets/body.svg';
import { ReactComponent as BodyBack } from '../../assets/bodyBack.svg';
import { ref, get, getDatabase, onValue, remove } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AiFillMinusCircle } from "react-icons/ai";
import ExerciseForm from './ExerciseForm/ExerciseForm';
import { AiFillPlusCircle } from "react-icons/ai";
import ExerciceList from './ExerciseList/ExerciceList';
import { Link } from 'react-router-dom';


const BodyMap = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [isFrontView, setIsFrontView] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [showAllExercises, setShowAllExercises] = useState(false);
  const [allExercises, setAllExercises] = useState([]);
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

  useEffect(() => {
    if (user){
      fetchAllExercises();
    }
  }, []); // [] garantit que l'effet est appelé uniquement lors du montage du composant
  

  const handleMuscleClick = (e) => {
    const muscle = e.target.id;
    setSelectedMuscle(muscle);
    filterExercices(muscle);
  };

  const filterExercices = (selectedMuscle) => {
    if (!selectedMuscle) {
      setExercises(allExercises); // Affiche tous les exercices si aucun muscle sélectionné
      return;
    }
  
    const filteredExercises = allExercises.filter((exercise) =>
      exercise.muscles && exercise.muscles.includes(selectedMuscle)
    );
  
    setExercises(filteredExercises); // Met à jour la liste affichée
  };

  const fetchAllExercises = async () => {
    console.log("test")
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

  const toggleView = () => {
    setIsFrontView((prevView) => !prevView);
  };

  const handleToggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };
  
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
            {user && (selectedMuscle === null || selectedMuscle === "") && (
              <div className="exercise-list-container">
                <h2>{selectedMuscle}</h2>
                <p>List of exercises for {selectedMuscle}:</p>
                <ExerciceList exercises={allExercises} user={user} />
            </div>
            )}
            {user && selectedMuscle && (
              <div className="exercise-list-container">
                <h2>{selectedMuscle}</h2>
                <p>List of exercises for {selectedMuscle}:</p>
                <ExerciceList exercises={exercises} user={user} />
              </div>
            )}
            {!user &&(
              <>
              <div className="login-section">
                <p className="login-message">
                 Log in to unlock personalized <span>exercises</span> 
                </p>
                <Link to="/authForm">
                  <button className="hero-btn login-btn">Login</button>
                </Link>
              </div>
            </>
            
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