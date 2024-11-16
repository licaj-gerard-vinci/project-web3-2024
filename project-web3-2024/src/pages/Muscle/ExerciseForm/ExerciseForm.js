import './ExerciseForm.css'
import Select from 'react-select';
import { getStorage, uploadBytes, getDownloadURL, ref as storageRef } from "firebase/storage";
import { ref, getDatabase, onValue, set } from "firebase/database";
import React, { useEffect, useState } from 'react';
import { AiFillMinusCircle } from "react-icons/ai";



const ExerciseForm = ( {showForm, handleToggleForm} ) => {
  const [muscles, setCategories] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    difficulty: "",
    muscles: []
  });
  const storage = getStorage();
  const db = getDatabase();



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
};

useEffect(() => {
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
}, [db])


const handleSubmit = async (e) => {
  e.preventDefault();
  console.log(formData.difficulte);
  if (!formData.name || !formData.description || !formData.muscles || !videoFile) {
    console.log("Veuillez remplir tous les champs et ajouter un fichier vidéo");
    return;
  }
  if (formData.difficulte === undefined){
    formData.difficulte = "Easy";
  }
  handleToggleForm();
  const place = storageRef(storage, `videos/${formData.name}-${Date.now()}`);
  try {
    await uploadBytes(place, videoFile);
    const videoUrl = await getDownloadURL(place);

    set(ref(db, `exercises/${formData.name}`), {
      name: formData.name,
      description: formData.description,
      difficulty: formData.difficulte,
      url: videoUrl, 
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

    return (
      <div>
        {showForm && (<div className="modal-overlay">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <h3 className='h3'>Add Exercice</h3>
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
              <button className="minus-button" onClick={handleToggleForm}>
              <AiFillMinusCircle />
            </button>
            </div>
          </div>)}
        </div>
    )
}

export default ExerciseForm;