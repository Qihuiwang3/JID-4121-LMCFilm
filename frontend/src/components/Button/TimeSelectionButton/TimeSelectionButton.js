import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TimeSelectionButton.css';
import calendarIcon from '../../../Image/calendar.svg';

function TimeSelectionButton({ initialPickupDateTime, initialReturnDateTime, onPickupDateTimeChange, onReturnDateTimeChange }) {
    const [pickupDateTime, setPickupDateTime] = useState(initialPickupDateTime);
    const [returnDateTime, setReturnDateTime] = useState(initialReturnDateTime);
    const pickupRef = useRef(null);
    const returnRef = useRef(null);

    useEffect(() => {
        if (initialPickupDateTime) {
            setPickupDateTime(new Date(initialPickupDateTime));
        }
        if (initialReturnDateTime) {
            setReturnDateTime(new Date(initialReturnDateTime));
        }
    }, [initialPickupDateTime, initialReturnDateTime]);

    const handlePickupChange = (date) => {
        const newDate = new Date(date);
        setPickupDateTime(newDate);
        onPickupDateTimeChange(newDate);  // Call the prop function to notify the parent
        if (newDate >= returnDateTime) {
            const newReturnDateTime = new Date(newDate.getTime() + 15 * 60000);
            setReturnDateTime(newReturnDateTime);
            onReturnDateTimeChange(newReturnDateTime); // Adjust the return time if necessary
        }
    };

    const handleReturnChange = (date) => {
        const newDate = new Date(date);
        setReturnDateTime(newDate);
        onReturnDateTimeChange(newDate); // Call the prop function to notify the parent
    };

    const openPickupCalendar = () => {
        pickupRef.current.setOpen(true);
    };

    const openReturnCalendar = () => {
        returnRef.current.setOpen(true);
    };

    return (
        <div className="time-selection-container">
            <div className="time-selection">
                <div className="time-button">
                    <DatePicker
                        ref={pickupRef}
                        selected={pickupDateTime}
                        onChange={handlePickupChange}
                        dateFormat="h:mm aa, MM/dd"
                        showTimeSelect
                        minDate={new Date()}
                        timeIntervals={15}
                    />
                    <div className="icon-container" onClick={openPickupCalendar}>
                        <img src={calendarIcon} alt="Calendar" className="icon" />
                    </div>
                </div>
                <span>to</span>
                <div className="time-button">
                    <DatePicker
                        ref={returnRef}
                        selected={returnDateTime}
                        onChange={handleReturnChange}
                        dateFormat="h:mm aa, MM/dd"
                        showTimeSelect
                        minDate={pickupDateTime}
                        timeIntervals={15}
                    />
                    <div className="icon-container" onClick={openReturnCalendar}>
                        <img src={calendarIcon} alt="Calendar" className="icon" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TimeSelectionButton;
