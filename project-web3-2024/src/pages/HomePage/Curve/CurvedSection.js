import React from 'react';
import './CurvedSection.css';

const CurvedSection = ({ children }) => {
    return (
        <div className="section-with-svg-curve">
            <svg className="curve" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#0a0a0c" fillOpacity="1" d="M0,160L80,170.7C160,181,320,203,480,208C640,213,800,203,960,181.3C1120,160,1280,128,1360,112L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default CurvedSection;