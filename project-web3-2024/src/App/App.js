import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from '../pages/Home'; // Adjust paths based on your structure
import About from '../pages/About'; // Adjust paths based on your structure
import Exemple from '../pages/Exemple2'; // Adjust paths based on your structure

function App() {
  return (
    <Router>
      <div className="homepage">
        <nav className="navbar">
          <div className="navbar-logo">
            <img src="path_to_logo.png" alt="GYMFITO Logo" />
          </div>
          <ul className="navbar-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
          <button className="join-now-btn">Join Now</button>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Exemple />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
