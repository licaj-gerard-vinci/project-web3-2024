import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, get, update } from 'firebase/database';
import { db, storage } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import ProfileForm from '../SurveryProfil/SurveryProfil.js';
import './Profil.css';

ReactModal.setAppElement('#root');

const Profil = () => {
  const [user, setUser] = useState(null);
<<<<<<< HEAD
  const [profileData, setProfileData] = useState({});
  const [showFormModal, setShowFormModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
=======
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
>>>>>>> 85a6af3c2d3a4cb98861cf19634bb627cfa83978
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserProfile(currentUser.uid);
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
<<<<<<< HEAD
    setProfileData(userData || {});
    if (userData?.profileImageUrl) {
      setProfileImage(userData.profileImageUrl);
=======

    setFirstName(userData?.firstName || '');
    setLastName(userData?.lastName || '');
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
>>>>>>> 85a6af3c2d3a4cb98861cf19634bb627cfa83978
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageRef = storageRef(storage, `profilePictures/${user.uid}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);

      // Update the profile image URL in Firebase Database
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, { profileImageUrl: downloadURL });

      // Set the profile image in state
      setProfileImage(downloadURL);
    }
  };

  useEffect(() => {
    if (showFormModal) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
<<<<<<< HEAD
    return () => document.body.classList.remove('no-scroll');
  }, [showFormModal]);
=======
    setIsEditing(!isEditing);
  };

  const saveChanges = async () => {
    const userRef = ref(db, `users/${user.uid}`);
    await update(userRef, {
      firstName: firstName,
      lastName: lastName,
      age,
      gender
    });
    await fetchUserProfile(user.uid);
  };
>>>>>>> 85a6af3c2d3a4cb98861cf19634bb627cfa83978

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={profileImage || 'path/to/default-image.jpg'}
          alt="Profile"
          className="profile-image"
        />
        <input
          type="file"
          accept="image/*"
          id="profile-image-upload"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
<<<<<<< HEAD
        <label htmlFor="profile-image-upload" className="upload-button">
          Change Photo
        </label>
        <h2>Votre Profil</h2>
      </div>
      <div className="profile-info">
        <p><strong>Prénom :</strong> {profileData?.prenom || 'N/A'}</p>
        <p><strong>Nom :</strong> {profileData?.nom || 'N/A'}</p>
        <p><strong>Âge :</strong> {profileData?.age || 'N/A'}</p>
        <p><strong>Sexe :</strong> {profileData?.gender || 'N/A'}</p>
      </div>

      <button className="complete-profile-button" onClick={() => setShowFormModal(true)}>
        Modifier information
      </button>

      <div className="favorites-section">
        <h3>Exercices Favoris</h3>
        <p>Aucun exercice favori trouvé.</p>
      </div>
      
      <button className="logout-button" onClick={() => getAuth().signOut()}>
        Déconnexion
      </button>

      <ReactModal
        isOpen={showFormModal}
        onRequestClose={() => setShowFormModal(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
        closeTimeoutMS={300}
      >
        <ProfileForm
          onClose={() => setShowFormModal(false)}
          initialData={{ prenom: profileData.prenom, nom: profileData.nom, age: profileData.age, gender: profileData.gender }}
        />
      </ReactModal>
    </div>
=======
      </ProfilePhotoContainer>
      <SectionTitle>Votre Profil</SectionTitle>
      <InfoContainer>
        <InfoRow>
          <Label>Prénom :</Label>
          <Text>{isEditing ? <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} /> : firstName}</Text>
        </InfoRow>
        <InfoRow>
          <Label>Nom :</Label>
          <Text>{isEditing ? <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} /> : lastName}</Text>
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
        {isEditing ? "Save" : "Modify"}
      </StyledButton>
      <SectionTitle>Favorite Exercises</SectionTitle>
      <InfoContainer>
        {favorites.length > 0 ? (
          favorites.map((exercise, index) => (
            <Text key={index}>{exercise}</Text>
          ))
        ) : (
          <Text>No favorite exercises found.</Text>
        )}
      </InfoContainer>
      <LogoutButton onClick={() => getAuth().signOut()}>Logout</LogoutButton>
    </ProfileContainer>
>>>>>>> 85a6af3c2d3a4cb98861cf19634bb627cfa83978
  );
};

export default Profil;
