import React, { useState } from 'react';
import './Bmi.css';

function BMICalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [bmi, setBmi] = useState(null);
  const [message, setMessage] = useState('');

  const calculateBMI = () => {
    if (!weight || !height || !age || !sex) {
      setMessage("Veuillez remplir tous les champs pour calculer votre BMI.");
      setBmi(null); // Réinitialise le BMI pour éviter d'afficher un résultat incorrect
      return;
    }

    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    setBmi(bmiValue);

    let category;
    if (bmiValue < 18.5) category = "Sous-poids";
    else if (bmiValue >= 18.5 && bmiValue < 24.9) category = "Poids normal";
    else if (bmiValue >= 25 && bmiValue < 29.9) category = "Surpoids";
    else category = "Obésité";

    if (sex === 'female' && age < 18) {
      setMessage(`Pour une jeune femme, votre BMI indique : ${category}`);
    } else if (sex === 'male' && age < 18) {
      setMessage(`Pour un jeune homme, votre BMI indique : ${category}`);
    } else if (sex === 'female') {
      setMessage(`Pour une femme adulte, votre BMI indique : ${category}`);
    } else {
      setMessage(`Pour un homme adulte, votre BMI indique : ${category}`);
    }
  };

  return (
    <div className="BMICalculator-container">
      <h2>BMI Calculator</h2>
      <div className="input-grid">
        <div>
          <div className="label-container">Weight (kg):</div>
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Enter weight" />
        </div>
        <div>
          <div className="label-container">Height (cm):</div>
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Enter height" />
        </div>
        <div>
          <div className="label-container">Age:</div>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
          />
        </div>
        <div>
          <div className="label-container">Sex:</div>
          <select value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="" disabled>Select sex</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>
      <button onClick={calculateBMI}>Calculate BMI</button>
      {bmi && (
        <div>
          <p>Your BMI is: {bmi}</p>
          <p>{message}</p>
        </div>
      )}
      {!bmi && message && (
        <div className="error-message">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default BMICalculator;