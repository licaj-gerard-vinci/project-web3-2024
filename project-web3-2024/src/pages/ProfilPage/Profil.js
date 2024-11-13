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
  const [profileData, setProfileData] = useState({});
  const [showFormModal, setShowFormModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
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
    setProfileData(userData || {});
    if (userData?.profileImageUrl) {
      setProfileImage(userData.profileImageUrl);
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
    return () => document.body.classList.remove('no-scroll');
  }, [showFormModal]);

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
        <h2>Your Profil</h2>
      </div>
      <div className="profile-info">
        <p><strong>First Name :</strong> {profileData?.firstName || 'N/A'}</p>
        <p><strong>Last Name :</strong> {profileData?.lastName || 'N/A'}</p>
        <p><strong>Age :</strong> {profileData?.age || 'N/A'}</p>
        <p><strong>Gender :</strong> {profileData?.gender || 'N/A'}</p>
      </div>

      <button className="complete-profile-button" onClick={() => setShowFormModal(true)}>
        Modifier information
      </button>

      <div className="favorites-section">
        <h3>Favorites exercices</h3>
        <p>Aucun exercice favori trouvé.</p>
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
          initialData={{ prenom: profileData.prenom, nom: profileData.nom, age: profileData.age, gender: profileData.gender }}
        />
      </ReactModal>
    </div>
  );
};

export default Profil;
