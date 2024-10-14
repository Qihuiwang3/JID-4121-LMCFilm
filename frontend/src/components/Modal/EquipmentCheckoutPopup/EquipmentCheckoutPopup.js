import React from 'react';
import './EquipmentCheckoutPopup.css';

const EquipmentCheckoutPopup = ({ onClose }) => {
    return (
        <div className="equipment-checkout-overlay" onClick={onClose}>
            <div className="equipment-checkout-content" onClick={(e) => e.stopPropagation()}>
                <h2>Scan</h2>
                <button
                        className="close-button"
                        onClick={onClose}
                    >
                        <div className='close-button-inner'>
                            &times;
                        </div>
                </button>
                <div className="equipment-checkout-input">
                    <label htmlFor="barcode">Bar Code</label>
                    <input type="text" id="barcode" className="checkout-modal-input"/>
                </div>
                
                <div className="equipment-checkout-input">
                    <label htmlFor="email">Student Email</label>
                    <input type="email" id="email" className="checkout-modal-input"/>
                </div>
                
                <div className="modal-footer">
                    <button className="cancelModal-button" onClick={onClose}>Cancel</button>
                    <button className="scan-search-button">Search</button>
                </div>
            </div>
        </div>
    );
};

export default EquipmentCheckoutPopup;
