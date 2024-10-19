import React from 'react';
import './SearchPopup.css';

const SearchPopup = ({ onClose, orderInfo }) => {
    if (!orderInfo) {
        return null; // If no orderInfo is available, don't render the popup
    }

    const { orderNumber, studentName, email, equipment } = orderInfo; 

    return (
        <div className="search-overlay" onClick={onClose}>
            <div className="search-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className='header-text'>Reservation Information</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="info-order-number">
                    <label htmlFor="orderNumber" className="search-label">Order Number</label>
                    <input
                        type="text"
                        id="orderNumber"
                        className="search-popup-input"
                        defaultValue={orderNumber} 
                        readOnly
                    />
                </div>
                <div className="search-section">
                    <div className="search-info-group">
                        <label htmlFor="student-name" className="search-label">Student Name</label>
                        <input
                            type="text"
                            id="student-name"
                            className="search-popup-input"
                            defaultValue={studentName}
                            readOnly
                        />
                    </div>
                    <div className="search-info-group">
                        <label htmlFor="student-email" className="search-label">Student Email</label>
                        <input
                            type="email"
                            id="student-email"
                            className="search-popup-input"
                            defaultValue={email} // Dynamically set value from orderInfo
                            readOnly
                        />
                    </div>
                </div>

                <h3 className="equipment-header">Equipment Check Out</h3>

                {equipment.map((item, index) => (
                    <div key={index} className="search-row">
                        <div className="search-item-group">
                            <label className="search-label">Item Name</label>
                            <input
                                type="text"
                                className="search-popup-input"
                                defaultValue={item} 
                                readOnly
                            />
                        </div>
                        <div className="search-item-group">
                            <label className="search-label">Scan the Item ID</label>
                            <input type="text" className="search-popup-input" /> 
                        </div>
                    </div>
                ))}

                <div className="modal-footer">
                    <button className="scan-cancel-button" onClick={onClose}>Cancel</button>
                    <button className="checkin-button">Student Checked In</button>
                </div>
            </div>
        </div>
    );
};

export default SearchPopup;
