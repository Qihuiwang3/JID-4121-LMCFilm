import React from "react";
import "./ConfirmationModal.css";

const ConfirmationModal = ({ show, onClose, onConfirm, title, message }) => {
    if (!show) return null;

    return (
        <div className="clear-modal-overlay">
            <div className="clear-modal-content">
                <h2 className="clear-modal-title">{title}</h2>
                <p className="clear-modal-message">{message}</p>
                <div className="clear-modal-buttons">
                    <button className="clear-modal-button cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="clear-modal-button confirm" onClick={onConfirm}>
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
