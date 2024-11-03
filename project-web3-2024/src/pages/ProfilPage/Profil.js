import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../firebaseConfig';
import { Navigate } from 'react-router-dom';
import './Profil.css';

const Profil = () => {
    const [user, setUser] = useState(null);
    const [consecutiveLogins, setConsecutiveLogins] = useState(0);
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [lastLoginDate, setLastLoginDate] = useState("");

    useEffect(() => {
        const auth = getAuth();
        let userRef = null;

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                userRef = ref(db, `users/${currentUser.uid}`);
                console.log("User signed in:", currentUser);

                const snapshot = await get(userRef);
                const userData = snapshot.val();

                const logins = userData?.consecutiveLogins || 0;
                const prenom = userData?.prenom || '';
                const email = userData?.email || '';
                const lastLoginDate = userData?.lastLoginDate || '';
                setConnecté(true);

                setUser(currentUser);
                setConsecutiveLogins(logins);
                setPrenom(prenom);
                setEmail(email);
                setLastLoginDate(lastLoginDate);
            } else {
                // L'utilisateur est déconnecté, réinitialise l'état
                setUser(null);
                setConsecutiveLogins(0);
                setPrenom("");
                setEmail("");
                setLastLoginDate("");
            }
        });
        return () => unsubscribe();
    }, []);

  

    return (
        <div className="profile-container">
            <h1 className="profile-header">Your Profile</h1>
            <div className="profile-info">
                <p><span>Consecutive Logins:</span> {consecutiveLogins}</p>
                <p><span>Prénom:</span> {prenom}</p>
                <p><span>Email:</span> {email}</p>
                <p><span>Last Login Date:</span> {lastLoginDate}</p>
            </div>
            <button className="logoutt-button" onClick={() => getAuth().signOut()}>Déconnexion</button>
        </div>
    );
};

export default Profil;
