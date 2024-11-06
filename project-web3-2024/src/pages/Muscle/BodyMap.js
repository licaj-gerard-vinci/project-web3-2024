import React, { useState, useEffect } from 'react';
import './BodyMap.css';
import { ReactComponent as BodyFront } from '../../assets/body.svg';
import { ReactComponent as BodyBack } from '../../assets/bodyBack.svg';
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const BodyMap = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [isFrontView, setIsFrontView] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    category: ""
  });
  const auth = getAuth();
  const db = getDatabase();
  useEffect(() => {
    // Écouter les changements d'état d'authentification de l'utilisateur
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
  }, [auth, db]);
  useEffect(() => {
    // Charger les catégories depuis Firebase
    const categoriesRef = ref(db, "categories/");
    onValue(categoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const categoriesList = Object.keys(data).map((key) => ({
          id: key,
          name: data[key].categorie // Assurez-vous que chaque catégorie a un champ "categorie"
        }));
        setCategories(categoriesList);
      }
    });
  }, [db]);
  console.log(isAdmin);
  

  const handleMuscleClick = (e) => {
    const muscle = e.target.id;
    setSelectedMuscle(muscle);
  };

  const toggleView = () => {
    setIsFrontView((prevView) => !prevView);
  };

  const handleToggleForm = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="main-container">
      <div className="body-map-container">
      <div>
        {isAdmin && !showForm && (
        <button className="fixed-button" onClick={handleToggleForm}>
          +
        </button>
        )}
        {isAdmin && showForm &&(
        <button className="fixed-button" onClick={handleToggleForm}>
          -
        </button>
        )}
      </div>
      <div>
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-overlay">
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
                Catégorie :
                  <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <button type="submit">Envoyer</button>
            </form>
          </div>
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