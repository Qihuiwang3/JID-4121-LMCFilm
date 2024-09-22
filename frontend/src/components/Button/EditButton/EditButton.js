import React from 'react';
import './EditButton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faEdit } from '@fortawesome/free-solid-svg-icons'; 

const EditButton = ({ onClick }) => {
  return (
    <div onClick={onClick}>
        <button className="edit-btn">
            Edit
            <FontAwesomeIcon icon={faEdit} className="edit-icon" />
        </button>
    </div>
  );
};

export default EditButton;
