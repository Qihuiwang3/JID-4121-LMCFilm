import React from 'react';
import './ReservationDetailPopup.css'; 

const ReservationDetailPopup = ({ onClose, reservationDetails }) => {
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
                        <input 
                            type="text" 
                            className="input-field" 
                            defaultValue={reservationDetails.orderNumber} 
                            readOnly 
                        />
                    </div>
                    <div className="info-group">
                        <label htmlFor="student-name" className="details-info-label">Student Name</label>
                        <input 
                            type="text" 
                            className="input-field" 
                            defaultValue={reservationDetails.studentName} 
                            readOnly 
                        />
                    </div>
                    <div className="info-group">
                        <label htmlFor="student-email" className="details-info-label">Student Email</label>
                        <input 
                            type="email" 
                            className="input-field" 
                            defaultValue={reservationDetails.email} 
                            readOnly 
                        />
                    </div>
                </div>

                <div className="view-equipment-sections">
                    <div className="view-equipment-checkout">
                        <h2 className="view-section-header">Equipment Check Out</h2>
                        {reservationDetails.equipment.map((item, index) => (
                            <div key={index} className="view-equipment-row">
                                <div className="view-equipment-group">
                                    <label className="view-equipment-label">Item Name</label>
                                    <input type="text" className="view-input-field" defaultValue={item.itemName} readOnly />
                                </div>
                                <div className="view-equipment-group">
                                    <label className="view-equipment-label">Item ID</label>
                                    <input type="text" className="view-input-field" defaultValue={item.itemId} readOnly />
                                </div>
                                <div className="view-equipment-group">
                                    <label className="view-equipment-label">Date Checked Out</label>
                                    <input type="text" className="view-input-field" defaultValue={reservationDetails.checkedout} readOnly/>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="view-equipment-checkin">
                        <h2 className="view-section-header">Equipment Check In</h2>
                        {reservationDetails.equipment.map((item, index) => (
                            <div key={index} className="view-equipment-row">
                                <div className="view-equipment-group">
                                    <label className="view-equipment-label">Item Name</label>
                                    <input type="text" className="view-input-field" defaultValue={item.itemName} readOnly />
                                </div>
                                <div className="view-equipment-group">
                                    <label className="view-equipment-label">Item ID</label>
                                    <input type="text" className="view-input-field" defaultValue={item.itemId} readOnly />
                                </div>
                                <div className="view-equipment-group">
                                    <label className="view-equipment-label">Date Checked In</label>
                                    <input type="text" className="view-input-field" defaultValue={reservationDetails.checkedin} readOnly/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="scan-cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ReservationDetailPopup;
