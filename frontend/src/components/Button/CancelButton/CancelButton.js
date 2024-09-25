import React from 'react';
import './CancelButton.css';

const CancelButton = ({ onClick }) => {
  return (
    <div onClick={onClick}>
      <button className="cancel-btn">
        Cancel
      </button>
    </div>
  );
};

export default CancelButton;
