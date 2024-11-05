import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { ref, get, set, update } from 'firebase/database';
import { db } from '../../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './Profil.css';

const Profil = () => {
  const [user, setUser] = useState(null);
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [errors, setErrors] = useState({});
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = ref(db, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();

        setPrenom(userData?.prenom || '');
        setNom(userData?.nom || '');
        setAge(userData?.age || '');
        setGender(userData?.gender || '');

        // Vérifie si le profil est complet
        setIsProfileComplete(!!userData?.age && !!userData?.gender);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!age) newErrors.age = "L'âge est requis";
    if (!gender) newErrors.gender = "Le sexe est requis";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const userRef = ref(db, `users/${user.uid}`);
    await update(userRef, { age, gender });

    // Marque le profil comme complet après l'enregistrement
    setIsProfileComplete(true);
  };

  return (
    <div className="profile-container">
      {!isProfileComplete ? (
        <div>
          <h1>Compléter votre profil</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Âge :</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
              {errors.age && <p className="error">{errors.age}</p>}
            </div>
            <div className="form-group">
              <label>Sexe :</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Sélectionner</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
              {errors.gender && <p className="error">{errors.gender}</p>}
            </div>
            <button type="submit">Enregistrer</button>
          </form>
        </div>
      ) : (
        <div className="profile-info">
          <h1>Votre Profil</h1>
          <p><strong>Prénom:</strong> {prenom}</p>
          <p><strong>Nom:</strong> {nom}</p>
          <p><strong>Âge:</strong> {age}</p>
          <p><strong>Sexe:</strong> {gender}</p>
          <button className="logout-button" onClick={() => getAuth().signOut()}>Déconnexion</button>
        </div>
      )}
    </div>
  );
};

export default Profil;
