import React, { useState } from 'react';
import './ViewExtendOrder.css';
import { updateOrderByOrderNumber } from '../../../connector';

const ViewExtendOrder = ({ show, orderNumber, currentReturnDate, equipment, handleClose, onOrderExtended }) => {
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');

    const handleUpdateOrder = async () => {
        try {
            // If newDate or newTime is empty, fall back to currentReturnDate and currentReturnTime
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
                beenExtended: true
            };

            await updateOrderByOrderNumber(orderNumber, updateData);
            onOrderExtended();
            handleClose();
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Failed to update order.');
        }
    };

    const combineDateTime = (date, time) => {
        const [timeString, period] = time.split(" ");
        let [hours, minutes] = timeString.split(":");

        if (period === "PM" && hours !== "12") {
            hours = parseInt(hours, 10) + 12;
        } else if (period === "AM" && hours === "12") {
            hours = "00";
        }

        const localDateTime = new Date(`${date}T${hours}:${minutes}:00`);

        const year = localDateTime.getUTCFullYear();
        const month = String(localDateTime.getUTCMonth() + 1).padStart(2, '0');
        const day = String(localDateTime.getUTCDate()).padStart(2, '0');
        const hour = String(localDateTime.getUTCHours()).padStart(2, '0');
        const minute = String(localDateTime.getUTCMinutes()).padStart(2, '0');
        const second = String(localDateTime.getUTCSeconds()).padStart(2, '0');
        const millisecond = String(localDateTime.getUTCMilliseconds()).padStart(3, '0');

        return `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}+00:00`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const minDate = formatDate(currentReturnDate);
    const maxDate = formatDate(new Date(new Date(currentReturnDate).setDate(new Date(currentReturnDate).getDate() + 5)));
    const initialDate = newDate || minDate;

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes} ${period}`;
    };

    const currentReturnTime = formatTime(currentReturnDate);

    const generateTimeOptions = () => {
        const options = [];
        const startTime = new Date();
        startTime.setHours(11, 0, 0, 0);

        const endTime = new Date();
        endTime.setHours(18, 0, 0, 0);

        while (startTime <= endTime) {
            const hours = startTime.getHours();
            const minutes = startTime.getMinutes();
            const period = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes.toString().padStart(2, '0');
            const timeString = `${formattedHours}:${formattedMinutes} ${period}`;
            options.push(timeString);
            startTime.setMinutes(startTime.getMinutes() + 15);
        }
        return options;
    };

    const timeOptions = generateTimeOptions();

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content4">
                <div className="modal-header">
                    <h2>Extend Return Date & Time</h2>
                    <button className="close-button" onClick={handleClose}>&times;</button>
                </div>

                <div className="extend-reservation-form">
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input 
                            type="date" 
                            id="date" 
                            className="input-fieldExtend" 
                            value={initialDate} 
                            onChange={(e) => setNewDate(e.target.value)} 
                            min={minDate} 
                            max={maxDate}
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
                            <option value="" disabled hidden>{currentReturnTime}</option>
                            {timeOptions.map((time, index) => (
                                <option key={index} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="cancelModal-button" onClick={handleClose}>Cancel</button>
                    <button className="saveModal-button" onClick={handleUpdateOrder}>Done</button>
                </div>
            </div>
        </div>
    );
};

export default ViewExtendOrder;
