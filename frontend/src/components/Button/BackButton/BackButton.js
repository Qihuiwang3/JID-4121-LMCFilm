import React from 'react';
import './BackButton.css';

const BackButton = ({ onClick }) => {
  return (
    <button className="back-btn" onClick={onClick}>
      Back
    </button>
  );
};

export default BackButton;
