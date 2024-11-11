import React, { useState } from 'react';
import './AuthForm.css';
import Login from '../Login/login';
import Register from '../Register/register';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);

  // Fonction pour basculer entre Login et Register
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-form-container">
      {isLogin && <Login toggleAuthForm={toggleForm} />} {/* Passe toggleForm en tant que prop */}
      {!isLogin && <Register toggleAuthForm={toggleForm} />} {/* Passe toggleForm en tant que prop */}
    </div>
  );
};

export default AuthForm;
