import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect, useRef } from 'react';
import { ref, get, update } from 'firebase/database';
import { db, storage } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, uploadBytes, ref as storageRef } from 'firebase/storage';
import styled from 'styled-components';
import  './Profil.css'

const ProfileContainer = styled.div`
  background-color: #1e1e1e;
  color: #f0f0f0;
  padding: 40px;
  border-radius: 15px;
  max-width: 600px;
  margin: 40px auto;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 10%;
`;

const ProfilePhotoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  cursor: pointer;

  img {
  background-color: #f0f0f0;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    object-fit: contain; /* Ajuste l'image pour qu'elle soit entièrement visible */
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    transform: scale(0.9); /* Optionnel : ajuste la taille pour dézoomer légèrement */
  }
`;



const SectionTitle = styled.h2`
  font-size: 1.5em;
  margin-bottom: 15px;
  color: #ff5722;
  text-align: center;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px 30px;
  background-color: #2c2c2c;
  border-radius: 10px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
  max-width: 500px;
  width: 100%;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Label = styled.span`
  font-weight: bold;
  color: #ff5722;
  flex: 1;
`;

const Text = styled.span`
  color: #e0e0e0;
  flex: 2;
  text-align: left;
`;

const StyledButton = styled.button`
  background-color: #ff5722;
  border: none;
  padding: 12px 25px;
  color: white;
  font-size: 1em;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 10px 0;

  &:hover {
    background-color: #e64a19;
  }

  &:focus {
    outline: none;
  }
`;

const LogoutButton = styled(StyledButton)`
  background-color: #333;
  width: 100%;
  margin-top: 20px;

  &:hover {
    background-color: #444;
  }
`;

const Profile = () => {
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

  const toggleEdit = () => {
    if (isEditing) {
      saveChanges();
    }
    setIsEditing(!isEditing);
  };

  const saveChanges = async () => {
    const userRef = ref(db, `users/${user.uid}`);
    await update(userRef, {
      prenom,
      nom,
      age,
      gender
    });
    await fetchUserProfile(user.uid);
  };

  return (
    <ProfileContainer>
      <ProfilePhotoContainer onClick={triggerFileInput}>
        <img
          src={photoURL || "https://via.placeholder.com/150"}
          alt="Photo de profil"
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handlePhotoChange}
        />
      </ProfilePhotoContainer>
      <SectionTitle>Votre Profil</SectionTitle>
      <InfoContainer>
        <InfoRow>
          <Label>Prénom :</Label>
          <Text>{isEditing ? <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} /> : prenom}</Text>
        </InfoRow>
        <InfoRow>
          <Label>Nom :</Label>
          <Text>{isEditing ? <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} /> : nom}</Text>
        </InfoRow>
        <InfoRow>
          <Label>Âge :</Label>
          <Text>{isEditing ? <input type="number" value={age} onChange={(e) => setAge(e.target.value)} /> : age}</Text>
        </InfoRow>
        <InfoRow>
          <Label>Sexe :</Label>
          <Text>{isEditing ? <select value={gender} onChange={(e) => setGender(e.target.value)}><option value="">Sélectionner</option><option value="male">Homme</option><option value="female">Femme</option></select> : gender}</Text>
        </InfoRow>
      </InfoContainer>
      <StyledButton onClick={toggleEdit}>
        {isEditing ? "Enregistrer" : "Modifier information"}
      </StyledButton>
      <SectionTitle>Exercices Favoris</SectionTitle>
      <InfoContainer>
        {favorites.length > 0 ? (
          favorites.map((exercise, index) => (
            <Text key={index}>{exercise}</Text>
          ))
        ) : (
          <Text>Aucun exercice favori trouvé.</Text>
        )}
      </InfoContainer>
      <LogoutButton onClick={() => getAuth().signOut()}>Déconnexion</LogoutButton>
    </ProfileContainer>
  );
};

export default Profile;
