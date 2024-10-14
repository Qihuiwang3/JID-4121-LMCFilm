import React from 'react';
import './EquipmentCheckoutPopup.css';

const EquipmentCheckoutPopup = ({ onClose }) => {
    return (
        <div className="equipment-checkout-overlay" onClick={onClose}>
            <div className="equipment-checkout-content" onClick={(e) => e.stopPropagation()}>
                <h2>Scan</h2>
                <div className="equipment-checkout-input">
                    <label htmlFor="barcode">Bar Code</label>
                    <input type="text" id="barcode" placeholder="Scan or enter Bar Code" />
                </div>
                
                <div className="equipment-checkout-input">
                    <label htmlFor="email">Student Email</label>
                    <input type="email" id="email" placeholder="Enter Student Email" />
                </div>
                
                <div className="equipment-checkout-buttons">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                    <button className="scan-search-button">Search</button>
                </div>
            </div>
        </div>
    );
};

export default EquipmentCheckoutPopup;
