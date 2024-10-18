import React, { useState } from 'react';
import './ScanPopup.css';
import SearchPopup from '../SearchPopup/SearchPopup';

const ScanPopup = ({ onClose, selectedOption, onOptionChange }) => {
    const [showSearchPopup, setShowSearchPopup] = useState(false);

    const handleSearchClick = () => {
        console.log("showSearchPopup?", showSearchPopup)

        setShowSearchPopup(true);
    };

    const closeSearchPopup = () => {
        setShowSearchPopup(false);
        // Close the ScanPopup as well 
        onClose(); 
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Scan</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                
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

                <div className="scan-input">
                    <label htmlFor="barcode">Order Number</label>
                    <input type="text" id="barcode" className="checkout-modal-input"/>
                </div>

                <div className="or-text">
                    OR
                </div>
                
                <div className="scan-input">
                    <label htmlFor="email">Student Email</label>
                    <input type="email" id="email" className="checkout-modal-input"/>
                </div>
                
                <div className="modal-footer">
                    <button className="scan-cancel-button" onClick={onClose}>Cancel</button>
                    <button 
                        className="scan-search-button" 
                        onClick={handleSearchClick}
                    >
                        Search
                    </button>
                </div>
                
                {showSearchPopup && 
                    <SearchPopup onClose={closeSearchPopup} />
                }
            </div>
        </div>
    );
};

export default ScanPopup;
