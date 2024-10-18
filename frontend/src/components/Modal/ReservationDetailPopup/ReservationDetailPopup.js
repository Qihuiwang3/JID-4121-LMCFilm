import React from 'react';
import './ReservationDetailPopup.css'; 

const ReservationDetailPopup = ({ onClose }) => {
    return (
        <div className="view-modal-overlay" onClick={onClose}>
            <div className="view-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Reservation Details</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="details-section">
                    <div className="details-info-group">
                        <label htmlFor="order-number" className="details-info-label">Order Number</label>
                        <input type="text" id="barcode" className="input-field" defaultValue="00001" readOnly />
                    </div>
                    <div className="info-group">
                        <label htmlFor="student-name" className="details-info-label">Student Name</label>
                        <input type="text" id="student-name" className="input-field" defaultValue="Qihui Wang" readOnly />
                    </div>
                    <div className="info-group">
                        <label htmlFor="student-email" className="details-info-label">Student Email</label>
                        <input type="email" id="student-email" className="input-field" defaultValue="qwang491@gatech.edu" readOnly />
                    </div>
                </div>

                <div className="view-equipment-sections">
                    <div className="view-equipment-checkout">
                        <h2 className="view-section-header">Equipment Check Out</h2>
                        {[1, 2, 3].map((item, index) => (
                            <div key={index} className="view-equipment-row">
                                <div className="view-equipment-group">
                                    <label className="view-equipment-label">Item Name</label>
                                    <input type="text" className="view-input-field" defaultValue={`Camera ${String.fromCharCode(64 + item)}`} readOnly />
                                </div>
                                <div className="view-equipment-group">
                                    <label className="view-equipment-label">Item ID</label>
                                    <input type="text" className="view-input-field" />
                                </div>
                                <div className="view-equipment-group">
                                    <label className="view-equipment-label">Date Checked Out</label>
                                    <input type="text" className="view-input-field" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="view-equipment-checkin">
                        <h2 className="view-section-header">Equipment Check In</h2>
                        {[1, 2, 3].map((item, index) => (
                            <div key={index} className="view-equipment-row">
                                <div className="view-equipment-group">
                                    <label className="view-equipment-label">Item Name</label>
                                    <input type="text" className="view-input-field" defaultValue={`Camera ${String.fromCharCode(64 + item)}`} readOnly />
                                </div>
                                <div className="view-equipment-group">
                                    <label className="view-equipment-label">Item ID</label>
                                    <input type="text" className="view-input-field" />
                                </div>
                                <div className="view-equipment-group">
                                    <label className="view-equipment-label">Date Checked In</label>
                                    <input type="text" className="view-input-field" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


                <div className="modal-footer">
                    <button className="scan-cancel-button" onClick={onClose}>Cancel</button>
                    <button className="scan-search-button">Done</button>
                </div>
            </div>
        </div>
    );
};

export default ReservationDetailPopup;
