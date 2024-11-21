import React, { useState } from 'react';
import './ViewExtendOrder.css';
import { updateOrderByOrderNumber } from '../../../connector';
import ExtendDate from '../ExtendDateModal/ExtendDate';import SuccessPopup from '../SuccessPopup/SuccessPopup';

const ViewExtendOrder = ({ show, orderNumber, currentReturnDate, equipment, handleClose, onOrderExtended }) => {
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [showExtendPopup, setShowExtendPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const handleConfirmExtension = async () => {
        try {
            const dateToUse = newDate || formatDate(currentReturnDate);
            const timeToUse = newTime || formatTime(currentReturnDate);
            const combinedDateTime = combineDateTime(dateToUse, timeToUse);

            const updateData = {
                equipment: equipment,
                checkedinStatus: true,
                checkout: combinedDateTime,
                checkedoutStatus: false,
                checkedout: null,
                checkedin: null,
                beenExtended: true,
            };

            await updateOrderByOrderNumber(orderNumber, updateData);

            setShowExtendPopup(false); // Close ExtendPopup
            setShowSuccessPopup(true); // Show SuccessPopup
            onOrderExtended(); // Notify parent about the update
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order.');
        }
    };

    const combineDateTime = (date, time) => {
        const [timeString, period] = time.split(' ');
        let [hours, minutes] = timeString.split(':');

        if (period === 'PM' && hours !== '12') {
            hours = parseInt(hours, 10) + 12;
        } else if (period === 'AM' && hours === '12') {
            hours = '00';
        }

        return `${date}T${hours}:${minutes}:00.000+00:00`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes} ${period}`;
    };

    const generateTimeOptions = () => {
        const options = [];
        const startTime = new Date();
        startTime.setHours(9, 0, 0, 0);

        const endTime = new Date();
        endTime.setHours(18, 0, 0, 0);

        while (startTime <= endTime) {
            const hours = startTime.getHours();
            const minutes = String(startTime.getMinutes()).padStart(2, '0');
            const period = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            options.push(`${formattedHours}:${minutes} ${period}`);
            startTime.setMinutes(startTime.getMinutes() + 15);
        }
        return options;
    };

    const timeOptions = generateTimeOptions();

    if (!show) {
        return null;
    }

    return (
        <>
            {/* Main Modal */}
            <div className="modal-overlay">
                <div className="modal-content4">
                    <div className="modal-header">
                        <h2>Extend Return Date & Time</h2>
                    </div>

                    <div className="extend-reservation-form">
                        <div className="form-group">
                            <label htmlFor="date">Date</label>
                            <input
                                type="date"
                                id="date"
                                className="input-fieldExtend"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                min={formatDate(currentReturnDate)}
                                max={formatDate(new Date(new Date(currentReturnDate).setDate(new Date(currentReturnDate).getDate() + 5)))}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="time">Time</label>
                            <select
                                id="time"
                                className="input-fieldExtend"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                            >
                                <option value="" disabled hidden>
                                    Select Time
                                </option>
                                {timeOptions.map((time, index) => (
                                    <option key={index} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="cancelModal-button" onClick={handleClose}>
                            Cancel
                        </button>
                        <button
                            className="saveModal-button"
                            disabled={!newDate || !newTime}
                            onClick={() => setShowExtendPopup(true)} // Trigger ExtendPopup
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>

            {/* ExtendPopup */}
            <ExtendDate
                show={showExtendPopup}
                handleClose={() => setShowExtendPopup(false)}
                handleConfirm={handleConfirmExtension} // Update order on confirm
            />

            {/* SuccessPopup */}
            <SuccessPopup
                show={showSuccessPopup}
                handleClose={() => {
                    setShowSuccessPopup(false);
                    handleClose(); // Optionally close the parent modal
                }}
            />
        </>
    );
};

export default ViewExtendOrder;
