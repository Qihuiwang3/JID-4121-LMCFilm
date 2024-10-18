import React from 'react';
import './SearchPopup.css';

const SearchPopup = ({ onClose }) => {
    return (
        <div className="search-overlay" onClick={onClose}>
            <div className="search-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="search-header">
                    Reservation Information
                    <button className="close-button" onClick={onClose}>&times;</button>
                </h2>

                <div className="info-order-number">
                    <label htmlFor="orderNumber" className="search-label">Order Number</label>
                    <input type="text" id="orderNumber" className="search-popup-input" defaultValue="00001" readOnly />
                </div>
                <div className="search-section">
                    <div className="info-group">
                        <label htmlFor="student-name" className="search-label">Student Name</label>
                        <input type="text" id="student-name" className="search-popup-input" defaultValue="Qihui Wang" readOnly />
                    </div>
                    <div className="info-group">
                        <label htmlFor="student-email" className="search-label">Student Email</label>
                        <input type="email" id="student-email" className="search-popup-input" defaultValue="qwang491@gatech.edu" readOnly />
                    </div>
                </div>

                <h3 className="equipment-header">Equipment Check Out</h3>

                {[1, 2, 3].map((item, index) => (
                    <div key={index} className="search-row">
                        <div className="search-item-group">
                            <label className="search-label">Item Name</label>
                            <input type="text" className="search-popup-input" defaultValue={`Camera ${String.fromCharCode(64 + item)}`} readOnly />
                        </div>
                        <div className="search-item-group">
                            <label className="search-label">Scan the Item ID</label>
                            <input type="text" className="search-popup-input" placeholder="Enter Item ID" />
                        </div>
                    </div>
                ))}

                <div className="search-footer">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                    <button className="submit-button">Student Checked In</button>
                </div>
            </div>
        </div>
    );
};

export default SearchPopup;
