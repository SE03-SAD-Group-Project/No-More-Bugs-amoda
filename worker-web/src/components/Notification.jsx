import React from 'react';
import './Notification.css';

const Notification = ({ message, type }) => {
  if (!message) return null;

  // Choose Icon based on type
  const icon = type === 'success' ? '✅' : '⚠️';

  return (
    <div className="notification-overlay">
      <div className={`notification-box ${type}`}>
        <span className="notification-icon">{icon}</span>
        <p className="notification-text">{message}</p>
      </div>
    </div>
  );
};

export default Notification;