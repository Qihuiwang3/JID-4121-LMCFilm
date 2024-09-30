import React from 'react';
import './EditButton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const EditButton = ({ isEditMode, toggleEditMode }) => {
    if (isEditMode) {
        return null; // Do not render the Edit button in edit mode
    }

    return (
        <div onClick={toggleEditMode}>
            <button className="edit-btn">
                Edit
                <FontAwesomeIcon icon={faEdit} className="edit-btn-icon" />
            </button>
        </div>
    );
};

export default EditButton;
