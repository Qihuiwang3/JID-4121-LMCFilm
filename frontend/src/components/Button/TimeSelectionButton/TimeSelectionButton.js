import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TimeSelectionButton.css'
import calendarIcon from '../../../Image/calendar.svg'

function TimeSelectionButton({initialPickupDateTime, initialReturnDateTime }){
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
    if (newDate >= returnDateTime) {
      setReturnDateTime(new Date(newDate.getTime() + 15 * 60000)); 
    }
  };

  const handleReturnChange = (date) => {
    setReturnDateTime(date);
  };

  const getMinReturnDateTime = (selectedDate) => {
    if (pickupDateTime.toDateString() === returnDateTime.toDateString()) {
      if (new Date().toDateString() === pickupDateTime.toDateString()) {
        return new Date(Math.max(pickupDateTime.getTime(), new Date().getTime()) + 15 * 60000);
      }
      return new Date(pickupDateTime.getTime() + 15 * 60000);
    } else {
      const selectedDayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      return new Date(selectedDayStart);
    }
  };

  function endOfDay(date) {
    return new Date(date.setHours(23, 45, 0, 0));
  }

  const minTimeForPickup = (selectedDate) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const selectedDayStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    return today.getTime() === selectedDayStart.getTime() ? now : new Date(selectedDayStart);
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
              minTime={minTimeForPickup(pickupDateTime)}
              maxTime={endOfDay(new Date())}
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
            minTime={getMinReturnDateTime(returnDateTime)}
            maxTime={endOfDay(new Date())}
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