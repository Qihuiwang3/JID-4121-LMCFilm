import React, { useState } from 'react';
import './ScanPopup.css';
import SearchPopup from '../SearchPopup/SearchPopup';

const ScanPopup = ({ onClose, selectedOption, onOptionChange }) => {
    const [showSearchPopup, setShowSearchPopup] = useState(false);

    const handleSearchClick = () => {
        setShowSearchPopup(true);
    };

    const closeSearchPopup = () => {
        setShowSearchPopup(false);
        // Close the ScanPopup as well 
        onClose(); 
    };

    if (showSearchPopup) {
        return <SearchPopup onClose={closeSearchPopup} />;
    }

    return (
        <div className="equipment-checkout-overlay" onClick={onClose}>
            <div className="equipment-checkout-content" onClick={(e) => e.stopPropagation()}>
                <h2>Scan</h2>
                <button className="close-button" onClick={onClose}>
                    <div className='close-button-inner'>&times;</div>
                </button>
                
                <div className="radio-input">
                    <label>
                        <input
                            type="radio"
                            value="checkout"
                            checked={selectedOption === 'checkout'}
                            onChange={onOptionChange}
                        />
                        Equipment Check Out
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="checkin"
                            checked={selectedOption === 'checkin'}
                            onChange={onOptionChange}
                        />
                        Equipment Check In
                    </label>
                </div>

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
                    <button 
                        className="scan-search-button" 
                        onClick={handleSearchClick}
                        // Disable until a radio button is selected
                        disabled={!selectedOption} 
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScanPopup;
