import React from 'react';
import './ExtendDate.css'; // Ensure this file matches the CSS provided earlier

const ExtendDate = ({ show, handleConfirm, handleClose }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="extend-popup-container">
                <div className="extend-header">
                    Attention!
                </div>
                <div className="extend-message">
                    The return date and time can be extended for free just once.
                </div>
                <div className="extend-modal-btn">
                    <div onClick={handleClose} className="extend-cancel">
                        Cancel
                    </div>
                    <div onClick={handleConfirm} className="extend-confirm">
                        Confirm
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExtendDate;
