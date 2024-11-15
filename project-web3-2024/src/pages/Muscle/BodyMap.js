import React, { useState, useEffect } from 'react';
import './BodyMap.css';
import { ReactComponent as BodyFront } from '../../assets/body.svg';
import { ReactComponent as BodyBack } from '../../assets/bodyBack.svg';
import { ref, get, getDatabase, onValue, set, remove } from "firebase/database";
import { getStorage, uploadBytes, getDownloadURL, ref as storageRef } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Select from 'react-select';
import { AiFillPlusCircle } from "react-icons/ai";
import { AiFillMinusCircle } from "react-icons/ai";
import { MdOutlineMoreVert } from "react-icons/md";
import VideosPlayer from '../VideosPlayer/VideosPlayer';
import { IoHeartOutline } from "react-icons/io5";
import { IoHeartSharp } from "react-icons/io5";

const BodyMap = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [isFrontView, setIsFrontView] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [muscles, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [showDescription, setShowDescription] = useState({}); // état pour gérer l'affichage des descriptions
  const [videoFile, setVideoFile] = useState(null); // Nouvel état pour le fichier vidéo
  const [likes, setLikes] = useState({}); // État pour stocker les likes en temps réel
  const [showAllExercises, setShowAllExercises] = useState(false);
  const [allExercises, setAllExercises] = useState([]);



  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    difficulty: "",
    muscles: []
  });
  const [exercises, setExercises] = useState([]);
  const auth = getAuth();
  const db = getDatabase();
  const storage = getStorage();

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
    const categoriesRef = ref(db, "muscles/");
    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const categoriesList = Object.keys(data).map((key) => ({
          id: key,
          name: data[key].name // Assurez-vous que chaque catégorie a un champ "categorie"
        }));
        setCategories(categoriesList);
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

  const handleToggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData.difficulte);
    if (!formData.name || !formData.description || !formData.muscles || !videoFile) {
      console.log("Veuillez remplir tous les champs et ajouter un fichier vidéo");
      return;
    }
    if (formData.difficulte === ""){
      formData.difficulte = "Facile";
    }
    handleToggleForm();
    // Téléchargement du fichier vidéo sur Firebase Storage
    const place = storageRef(storage, `videos/${formData.name}-${Date.now()}`);
    try {
      await uploadBytes(place, videoFile);
      const videoUrl = await getDownloadURL(place);

      // Sauvegarde des informations de l'exercice dans Firebase Database
      set(ref(db, `exercises/${formData.name}`), {
        name: formData.name,
        description: formData.description,
        difficulty: formData.difficulte,
        url: videoUrl,   // Enregistrer l'URL de la vidéo
        muscles: formData.muscles
      });
      console.log("Exercice ajouté avec succès");
      setVideoFile(null);
      setFormData({
        name: "",
        description: "",
        difficulte: "",
        muscles: []
      });
    } catch (error) {
      console.error("Erreur lors du téléchargement de la vidéo :", error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#333333',
      borderRadius: '4px',
      border: state.isFocused ? '2px solid #ff5c2b' : '2px solid transparent',
      boxShadow: 'none',
      padding: '4px',
      fontSize: '16px',
      color: '#ff5c2b',
      transition: 'border-color 0.3s ease, background-color 0.3s ease',
      ':hover': {
        border: '2px solid #ff5c2b',
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#222222' : '#333333',
      color: state.isSelected ? '#ffffff' : '#ff5c2b',
      padding: '8px',
      cursor: 'pointer',
      ':active': {
        backgroundColor: '#444444',
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#333333',
      borderRadius: '4px',
      marginTop: '4px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      maxHeight: '200px',
      overflowY: 'hidden', // Cache la scrollbar, mais garde le défilement
      /* Cacher la scrollbar pour les navigateurs WebKit */
      '::-webkit-scrollbar': {
        display: 'none',
      },
      /* Cacher la scrollbar pour Firefox */
      scrollbarWidth: 'none',
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '200px', // Limite la hauteur de la liste
      overflowY: 'scroll', // Permet le défilement, mais sans scrollbar visible
      paddingRight: '10px', // Espace pour éviter le chevauchement
      '::-webkit-scrollbar': {
        display: 'none', // Cache la scrollbar dans Chrome et Safari
      },
      scrollbarWidth: 'none', // Cache la scrollbar dans Firefox
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#ff5c2b',
      backgroundColor: '#444444',
      padding: '4px 8px',
      borderRadius: '4px',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#444444',
      color: '#ff5c2b',
      borderRadius: '4px',
      padding: '2px 4px',
      marginRight: '4px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#ff5c2b',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#ff5c2b',
      cursor: 'pointer',
      ':hover': {
        backgroundColor: '#ff5c2b',
        color: '#ffffff',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#aaaaaa',
      fontStyle: 'italic',
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? '#ff5c2b' : '#aaaaaa',
      ':hover': {
        color: '#ff5c2b',
      },
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
  };
  
  const toggleDescription = (id) => {
    setShowDescription((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
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
      {showForm && (
        <div>
        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <h3>Add Exercice</h3>
                <div>
                  <label>
                    Name : <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                  </label>
                </div>
                <div>
                  <label>
                    Video : <input type="file" accept="video/*" onChange={handleFileChange} required />
                  </label>
                </div>
                <div>
                  <label>
                    Description : <input type="text" name="description" value={formData.description} onChange={handleChange} required />
                  </label>
                </div>
                <div>
                  <label>
                    Difficulty:
                    <select name="difficulte" value={formData.difficulte} onChange={handleChange} required>
                      <option color="#ff5c2b" value="easy">Easy</option>
                      <option value="average">Average</option>
                      <option value="difficult">Difficult</option>
                    </select>
                  </label>
                </div>
                <div>
                  <label>Muscles :</label>
                  <Select
                    styles={customStyles}
                    isMulti
                    options={muscles.map((category) => ({
                      value: category.name,
                      label: category.name
                    }))}
                    onChange={(selectedOptions) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        muscles: selectedOptions.map(option => option.value)
                      }));
                    }}
                    value={muscles
                      .filter(category => formData.muscles.includes(category.name))
                      .map(cat => ({ value: cat.name, label: cat.name }))}
                  />
                </div>
                <div>
                  <button type="submit">Save</button>
                </div>
              </form>
              {/* Bouton "-" sous le formulaire */}
              <button className="minus-button" onClick={handleToggleForm}>
                <AiFillMinusCircle />
              </button>
            </div>
          </div>
        )}
      </div>      
      )}
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
                        <p>Difficulty: {exercise.difficulte}</p>
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