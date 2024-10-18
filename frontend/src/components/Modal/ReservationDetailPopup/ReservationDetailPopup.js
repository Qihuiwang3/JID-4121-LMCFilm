import React from 'react';
import './ReservationDetailPopup.css'; 

const ReservationDetailPopup = ({ onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className='header-text'>Reservation Details</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="info-row">
                    <div className="info-group">
                        <label htmlFor="barcode" className="info-label">Bar Code</label>
                        <input type="text" id="barcode" className="input-field" defaultValue="00001" readOnly />
                    </div>
                    <div className="info-group">
                        <label htmlFor="student-name" className="info-label">Student Name</label>
                        <input type="text" id="student-name" className="input-field" defaultValue="Qihui Wang" readOnly />
                    </div>
                    <div className="info-group">
                        <label htmlFor="student-email" className="info-label">Student Email</label>
                        <input type="email" id="student-email" className="input-field" defaultValue="qwang491@gatech.edu" readOnly />
                    </div>
                </div>

                <h3 className="section-header">Equipment Check Out</h3>
                {[1, 2, 3].map((item, index) => (
                    <div key={index} className="equipment-row">
                        <div className="equipment-group">
                            <label className="equipment-label">Item Name</label>
                            <input type="text" className="input-field" defaultValue={`Camera ${String.fromCharCode(64 + item)}`} readOnly />
                        </div>
                        <div className="equipment-group">
                            <label className="equipment-label">Item ID</label>
                            <input type="text" className="input-field" />
                        </div>
                        <div className="equipment-group">
                            <label className="equipment-label">Date Checked Out</label>
                            <input type="text" className="input-field" />
                        </div>
                    </div>
                ))}

                <h3 className="section-header">Equipment Check In</h3>
                {[1, 2, 3].map((item, index) => (
                    <div key={index} className="equipment-row">
                        <div className="equipment-group">
                            <label className="equipment-label">Item Name</label>
                            <input type="text" className="input-field" defaultValue={`Camera ${String.fromCharCode(64 + item)}`} readOnly />
                        </div>
                        <div className="equipment-group">
                            <label className="equipment-label">Item ID</label>
                            <input type="text" className="input-field" />
                        </div>
                        <div className="equipment-group">
                            <label className="equipment-label">Date Checked In</label>
                            <input type="text" className="input-field" />
                        </div>
                    </div>
                ))}

                <div className="modal-footer">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                    <button className="done-button">Done</button>
                </div>
            </div>
        </div>
    );
};

export default ReservationDetailPopup;
