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
      setMessage("Please fill in all fields to calculate your BMI.");
      setBmi(null); // Reset BMI to avoid displaying an incorrect result
      return;
    }

    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    setBmi(bmiValue);

    let category;
if (bmiValue < 18.5) category = "Underweight";
else if (bmiValue >= 18.5 && bmiValue < 24.9) category = "Normal weight";
else if (bmiValue >= 25 && bmiValue < 29.9) category = "Overweight";
else category = "Obesity";

if (sex === 'female' && age < 18) {
  setMessage(`For a young woman, your BMI indicates: ${category}`);
} else if (sex === 'male' && age < 18) {
  setMessage(`For a young man, your BMI indicates: ${category}`);
} else if (sex === 'female') {
  setMessage(`For an adult woman, your BMI indicates: ${category}`);
} else {
  setMessage(`For an adult man, your BMI indicates: ${category}`);
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