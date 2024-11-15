import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { ref, update } from 'firebase/database';
import { db, storage } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import ProfileForm from '../SurveryProfil/SurveryProfil.js';
import './Profil.css';

ReactModal.setAppElement('#root');

const Profil = ({ user, onUserUpdate }) => {
  const [profileData, setProfileData] = useState(user || {});
  const [showFormModal, setShowFormModal] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.photoURL || null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setProfileData(user);
      if(user.photoURL) {
        setProfileImage(user.photoURL);
      } else {
        const defaultImageRef = storageRef(storage, 'HomePage/NavBar/default-pp.png');
        getDownloadURL(defaultImageRef).then((url) => setProfileImage(url));
      }
    }
  }, [user]);

  if(!user) {
    navigate('/');
    return null;
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageRef = storageRef(storage, `users/${user.uid}/pp`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);

      // Met à jour l'URL de la photo de profil dans Firebase Database
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, { photoURL: downloadURL });

      // Met à jour l'image de profil dans le composant et déclenche une mise à jour dans App.js
      setProfileImage(downloadURL);
      onUserUpdate(); // Appelle la fonction pour mettre à jour les données utilisateur dans App.js
    }
  };

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
        <label htmlFor="profile-image-upload" className="upload-button">
          Change Photo
        </label>
        <h2>Your profile</h2>
      </div>
      <div className="profile-info">
        <p><strong>First Name :</strong> {profileData?.firstName || 'N/A'}</p>
        <p><strong>Last Name :</strong> {profileData?.lastName || 'N/A'}</p>
        <p><strong>Age :</strong> {profileData?.age || 'N/A'}</p>
        <p><strong>Gender :</strong> {profileData?.gender || 'N/A'}</p>
      </div>

      <button className="complete-profile-button" onClick={() => setShowFormModal(true)}>
        Modify information
      </button>

      <div className="favorites-section">
        <h3>Favorite exercises</h3>
        <p>No exercises found</p>
      </div>
      
      <button className="logout-button" onClick={() => getAuth().signOut()}>
        Logout
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
          initialData={{ firstName: profileData.firstName, lastName: profileData.lastName, age: profileData.age, gender: profileData.gender }}
        />
      </ReactModal>
    </div>
  );
};

export default Profil;
