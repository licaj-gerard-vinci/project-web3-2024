import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect, useRef } from 'react';
import { ref, get, update } from 'firebase/database';
import { db, storage } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, uploadBytes, ref as storageRef } from 'firebase/storage';
import './Profil.css';

const Profil = () => {
  const [user, setUser] = useState(null);
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserProfile(currentUser.uid);
        await fetchFavorites(currentUser.uid);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fonction pour récupérer le profil de l'utilisateur
  const fetchUserProfile = async (userId) => {
    const userRef = ref(db, `users/${userId}`);
    const snapshot = await get(userRef);
    const userData = snapshot.val();

    setPrenom(userData?.prenom || '');
    setNom(userData?.nom || '');
    setAge(userData?.age || '');
    setGender(userData?.gender || '');
    setPhotoURL(userData?.photoURL || '');
  };

  // Fonction pour récupérer les exercices favoris de l'utilisateur
  const fetchFavorites = async (userId) => {
    const userRef = ref(db, `users/${userId}/favorites`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const favoriteIds = snapshot.val();
      const exercisePromises = favoriteIds.map((exerciseId) =>
        get(ref(db, `exercises/${exerciseId}`))
      );

      const exerciseSnapshots = await Promise.all(exercisePromises);
      const favoriteExercises = exerciseSnapshots
        .filter((snap) => snap.exists())
        .map((snap) => snap.val().name);

      setFavorites(favoriteExercises);
    }
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const photoStorageRef = storageRef(storage, `users/${user.uid}/pp`);
      await uploadBytes(photoStorageRef, file);
      const downloadURL = await getDownloadURL(photoStorageRef);
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, { photoURL: downloadURL });
      setPhotoURL(downloadURL);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Gérer l'édition des informations
  const toggleEdit = () => {
    if (isEditing) {
      saveChanges();
    }
    setIsEditing(!isEditing);
  };

  // Enregistrer les modifications dans la DB
  const saveChanges = async () => {
    const userRef = ref(db, `users/${user.uid}`);
    await update(userRef, {
      prenom,
      nom,
      age,
      gender
    });
    // Recharger les données après la sauvegarde
    await fetchUserProfile(user.uid);
  };

  return (
    <div className="profile-container">
      <div className="profile-info">
        <div className="profile-photo-container" onClick={triggerFileInput}>
          <img
            src={photoURL || "https://via.placeholder.com/100"}
            alt="Photo de profil"
            className="profile-photo"
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
        </div>
        <h1>Votre Profil</h1>
        
        <div className="form-group">
          <label>Prénom :</label>
          {isEditing ? (
            <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
          ) : (
            <p>{prenom}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>Nom :</label>
          {isEditing ? (
            <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
          ) : (
            <p>{nom}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>Âge :</label>
          {isEditing ? (
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          ) : (
            <p>{age}</p>
          )}
        </div>
        
        <div className="form-group">
          <label>Sexe :</label>
          {isEditing ? (
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Sélectionner</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          ) : (
            <p>{gender}</p>
          )}
        </div>

        <button className="edit-button" onClick={toggleEdit}>
          {isEditing ? "Enregistrer" : "Modifier information"}
        </button>

        <h2>Exercices Favoris</h2>
        <ul>
          {favorites.length > 0 ? (
            favorites.map((exercise, index) => (
              <li key={index}>{exercise}</li>
            ))
          ) : (
            <p>Aucun exercice favori trouvé.</p>
          )}
        </ul>

        
        
        <button className="logout-button" onClick={() => getAuth().signOut()}>Déconnexion</button>
      </div>
    </div>
  );
};

export default Profil;
