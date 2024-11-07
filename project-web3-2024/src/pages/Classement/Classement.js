import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import './Classement.css';



const Classement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("useEffect exécuté");
    const db = getDatabase();
    const usersRef = ref(db, 'users');

    // Récupérer les données des utilisateurs
    onValue(usersRef, (snapshot) => {
      console.log("useEffect exécuté");
      const data = snapshot.val();
      console.log(data); // Vérifiez ici si les données sont récupérées
      const usersArray = Object.keys(data || {}).map((key) => ({
          id: key,
          ...data[key],
      }));
      console.log("Array des utilisateurs:", usersArray); // Vérifiez la structure des données ici
  
      const sortedUsers = usersArray.sort(
          (a, b) => b.consecutiveLogins - a.consecutiveLogins
      );
      setUsers(sortedUsers);
  });
  }, []);

  return (
    <div className="classement">
      <h1>Classement des utilisateurs par connexions consécutives</h1>
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Connexions Consécutives</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.nom}</td>
              <td>{user.prenom}</td>
              <td>{user.consecutiveLogins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Classement;
