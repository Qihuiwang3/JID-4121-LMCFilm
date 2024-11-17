import React from 'react';
import './SuccessPopup.css'; // Ensure this file matches the CSS provided earlier

const SuccessPopup = ({ show, handleClose }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="success-popup-container">
                <div className="success-header">
                    Successful!
                </div>
                <div className="success-message">
                    Your return date and time now has been changed.
                </div>
                <div className="success-modal-btn">
                    <div onClick={handleClose} className="success-back">
                        Back
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPopup;
