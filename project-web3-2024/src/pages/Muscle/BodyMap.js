import React, { useState, useEffect } from 'react';
import './BodyMap.css';
import { ReactComponent as BodyFront } from '../../assets/body.svg';
import { ReactComponent as BodyBack } from '../../assets/bodyBack.svg';
import { ref, get, getDatabase, onValue, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { AiFillPlayCircle } from "react-icons/ai";
import { AiFillPlusCircle } from "react-icons/ai";
import { AiFillMinusCircle } from "react-icons/ai";


const BodyMap = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [isFrontView, setIsFrontView] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [muscles, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    difficulte: "",
    muscles: []
  });
  const [exercises, setExercises] = useState([]);
  const auth = getAuth();
  const navigate = useNavigate();
  const db = getDatabase();

  useEffect(() => {
    // Charger les catégories depuis Firebase
    onAuthStateChanged(auth, (user) => {
      if (user) {
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
  

  const handleMuscleClick = (e) => {
    const muscle = e.target.id;
    setSelectedMuscle(muscle);
    toggleExercises(muscle);
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
              url: exercise.url
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
  const reset = () => {
    formData.name = "";
    formData.url = "";
    formData.muscles = [];
    formData.description = "";
    formData.difficulte = "";
  }
  const handleSubmit = (e) => {
    if (!formData.name || !formData.url || !formData.muscles) {
      console.log("Veuillez remplir tous les champs");
      return;
    }
    e.preventDefault();
    set(ref(db, 'exercises/'+ formData.name),{
      name: formData.name,
      description:formData.description,
      difficulte: formData.difficulte,
      url: formData.url,
      muscles: formData.muscles
    })
    .then(() => {
      console.log("ok");
    })
    .catch((error) => {
      console.error(error);
    })
    navigate("/bodyMap");
    handleToggleForm();
    reset();
  }
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
  
  
  
  console.log(exercises)
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
                    Nom : <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                  </label>
                </div>
                <div>
                  <label>
                    URL : <input type="url" name="url" value={formData.url} onChange={handleChange} required />
                  </label>
                </div>
                <div>
                  <label>
                    Description : <input type="text" name="description" value={formData.description} onChange={handleChange} required />
                  </label>
                </div>
                <div>
                  <label>
                    Difficulté :
                    <select name="difficulty" value={formData.difficulte} onChange={handleChange} required>
                      <option color="#ff5c2b" value="easy">Facile</option>
                      <option value="medium">Moyen</option>
                      <option value="hard">Difficile</option>
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
                  <button type="submit">Envoyer</button>
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
        </div>
      {selectedMuscle ? (
        <>
          <h2>{selectedMuscle}</h2>
          <p>List of exercises for {selectedMuscle}:</p>
          {!isAdmin &&( 
            <div>Connectez-vous pour voir les exercices</div>
          )}
          <div className="exercise-grid">
            {exercises.length > 0 ? (
              exercises.map(exercise => (
                <div key={exercise.id} className="exercise-card">
                  <h3>{exercise.name}</h3>
                  <h2>{exercise.description}</h2>
                  <button
                    onClick={() => window.open(exercise.url, '_blank')}
                    className="play-button"
                  >
                    <AiFillPlayCircle />
                  </button>
                </div>
              ))
            ) : (
              <p>No exercises found for this muscle.</p>
            )}
          </div>
        </>
      ) : (
        <p>Select a muscle to see exercises and videos.</p>
      )}
    </div>

      <style>{`
        .svg-body path[id="${selectedMuscle}"] {
          fill: rgba(255, 85, 0.8); /* Light blue semi-transparent */
          stroke: rgb(255, 85, 0); /* Darker border on hover */
        }
      `}</style>
    </div>
  );
};

export default BodyMap;