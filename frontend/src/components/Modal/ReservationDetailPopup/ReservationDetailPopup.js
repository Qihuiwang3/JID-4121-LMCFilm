import React, { useState, useEffect } from 'react';
import './ReservationDetailPopup.css';
import ViewCancelOrder from '../viewCancelOrder/viewCancelOrder';
import ViewExtendOrder from '../ViewExtendOrder/ViewExtendOrder';


const formatDate = (dateString) => {
    console.log(dateString)
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const ReservationDetailPopup = ({ onClose, reservationDetails, onOrderCancelled, onOrderExtended }) => {
    const [canCancelOrder, setCanCancelOrder] = useState(false);
    const [cantExtendOrder, setCantExtendOrder] = useState(false);
    const [viewCancelID, setViewCancel] = useState(null);
    const [viewExtendID, setViewExtend] = useState(null);
    const [viewExtendIDDate, setViewExtendDate] = useState(null);
    const [viewExtendIDEquipment, setViewExtendEquipment] = useState(null);
    const handleViewCancel = (orderNumber) => {
        setViewCancel(orderNumber);
    }

    useEffect(() => {
        // Get current date and time
        const now = new Date();
        const checkoutDate = new Date(reservationDetails.checkout);
        const checkinDate = new Date(reservationDetails.checkin);

        // Calculate if the checkout date has already passed
        const hasCheckoutDatePassed = now > checkoutDate;

        // Calculate if the checkin date is more than 24 hours in the future
        const timeDifferenceToCheckin = checkinDate - now;
        const canCancel = timeDifferenceToCheckin > 24 * 60 * 60 * 1000;

        // Set states based on the conditions
        setCanCancelOrder(!hasCheckoutDatePassed && canCancel);
        setCantExtendOrder(hasCheckoutDatePassed || reservationDetails.beenExtended);
    }, [reservationDetails.checkout, reservationDetails.checkin, reservationDetails.beenExtended]);


    const handleCloseModal = () => {
        setViewExtend(null);
    };
    const handleViewExtend = (orderNumber, returnDate, equipment) => {

        setViewExtend(orderNumber);
        setViewExtendDate(returnDate);
        setViewExtendEquipment(equipment)

    }
    return (
        <>
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
                                        <input
                                            type="text"
                                            className="view-input-field"
                                            defaultValue={formatDate(reservationDetails.checkedout)}
                                            readOnly
                                        />
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
                                        <input
                                            type="text"
                                            className="view-input-field"
                                            defaultValue={formatDate(reservationDetails.checkedin)}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            className="cancel-reservation"
                            onClick={() => handleViewCancel(reservationDetails.orderNumber)} disabled={!canCancelOrder}
                        >
                            Cancel Reservation
                        </button>

                        <button className="extend-reservation" onClick={() => handleViewExtend(reservationDetails.orderNumber, reservationDetails.checkout, reservationDetails.equipment)} disabled={cantExtendOrder} >Extend Return Date & Time</button>
                    </div>
                </div>
            </div>
            {viewCancelID && (
                <ViewCancelOrder
                    show={!!viewCancelID}
                    orderNumber={viewCancelID}
                    handleClose={() => {
                        onClose();
                    }}
                    onOrderCancelled={onOrderCancelled}
                />
            )}
            {viewExtendID && (
                <ViewExtendOrder
                    show={!!viewExtendID}
                    orderNumber={viewExtendID}
                    currentReturnDate={viewExtendIDDate}
                    equipment={viewExtendIDEquipment}
                    handleClose={() => {
                        onClose();
                    }}
                    onOrderExtended={onOrderExtended}

                />
            )}

        </>

    );

};

export default ReservationDetailPopup;
