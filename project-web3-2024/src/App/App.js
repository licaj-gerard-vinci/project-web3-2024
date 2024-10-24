import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from '../pages/HomePage/Home';
import About from '../pages/About'; // Adjust paths based on your structure
import Exemple from '../pages/Exemple'; // Adjust paths based on your structure
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaFacebookF, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

function App() {
  return (
    <Router>
      <div className="homepage">
        {/* Social Bar */}
        <div className="social-bar">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
        </div>

        <nav className="navbar">
          <div className="navbar-logo">
            <img src="path_to_logo.png" alt="GYMFITO Logo" />
          </div>
          <ul className="navbar-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/exemple">Exemple</Link></li>
          </ul>
          <button className="join-now-btn">Join Now</button>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/exemple" element={<Exemple />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;