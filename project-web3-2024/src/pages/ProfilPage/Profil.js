import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';
import ProfileForm from '../Survery/ProfileForm';
import './Profil.css';

ReactModal.setAppElement('#root');

const Profil = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [showFormModal, setShowFormModal] = useState(false);
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
  };

    // Toggle the "no-scroll" class on the body element when the modal opens/closes
    useEffect(() => {
      if (showFormModal) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
      // Clean up the class when the component is unmounted
      return () => document.body.classList.remove('no-scroll');
    }, [showFormModal]);
  

  return (
    <div className="profile-container">
      <div className="profile-info">
        <h1>Votre Profil</h1>
        <p>{profileData?.prenom}</p>
        <p>{profileData?.nom}</p>
        <p>{profileData?.age}</p>
        <p>{profileData?.gender}</p>

        <button className="complete-profile-button" onClick={() => setShowFormModal(true)}>
          Complete Profile
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
            initialData={{ prenom: profileData.prenom, nom: profileData.nom }}
          />
        </ReactModal>
      </div>
    </div>
  );
};

export default Profil;
