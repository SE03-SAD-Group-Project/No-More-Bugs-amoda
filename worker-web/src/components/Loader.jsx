import React from 'react';
import './Loader.css';
import bearLogo from '../assets/nomorebugs_logo.png';

// Accept 'mode' prop. Default is 'fullscreen'.
const Loader = ({ mode = 'fullscreen' }) => {
  return (
    // If mode is 'content', add the 'content-mode' class
    <div className={`loader-overlay ${mode === 'content' ? 'content-mode' : ''}`}>
      <div className="loader-container">
        {/* The Spinning White Tail */}
        <div className="loader-ring"></div>
        
        {/* The Bear Face (Logo) */}
        <img src={bearLogo} alt="Loading..." className="bear-face" />
      </div>
      
      <h2 className="loading-text">Loading...</h2>
    </div>
  );
};

export default Loader;