import React from 'react';
import './App.css';

function App() {
  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="navbar-logo">
          <h1>Muscle Hub</h1>
        </div>
        <ul className="navbar-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      <header className="header">
        <h1 className="title">Muscle Training Hub</h1>
        <p className="subtitle">Select a muscle group to discover exercises tailored to your training goals.</p>
        <button className="cta-button">Get Started</button>
      </header>

      <section className="muscle-groups">
        <h2>Target Muscle Groups</h2>
        <div className="muscle-grid">
          <div className="muscle-card">
            <img src="https://via.placeholder.com/150" alt="Chest" />
            <h3>Chest</h3>
          </div>
          <div className="muscle-card">
            <img src="https://via.placeholder.com/150" alt="Arms" />
            <h3>Arms</h3>
          </div>
          <div className="muscle-card">
            <img src="https://via.placeholder.com/150" alt="Back" />
            <h3>Back</h3>
          </div>
          <div className="muscle-card">
            <img src="https://via.placeholder.com/150" alt="Legs" />
            <h3>Legs</h3>
          </div>
          <div className="muscle-card">
            <img src="https://via.placeholder.com/150" alt="Abs" />
            <h3>Abs</h3>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>Start your journey to a stronger you today!</p>
      </footer>
    </div>
  );
}

export default App;
