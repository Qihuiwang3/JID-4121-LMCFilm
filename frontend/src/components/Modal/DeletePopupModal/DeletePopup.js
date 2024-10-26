import React from 'react';
import './DeletePopup.css'; // Ensure to style it appropriately'

const DeletePopup = ({ show, handleClose, handleDelete }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="delete-popup-container">

                <div className="delete-header">Attention!</div>

                <div className="delete-message"> You are about to delete this information from the database. </div>
                <div className="delete-message"> Are you sure you want to delete it? </div>

                <div className="delete-modal-btn">

                    <div onClick={handleClose} className="delete-cancel">Cancel</div>
                    <div onClick={handleDelete} className="delete-confirm">Yes</div>
                </div>
            </div>
        </div>
    );
};

export default DeletePopup;