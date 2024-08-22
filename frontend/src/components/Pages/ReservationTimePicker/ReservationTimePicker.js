import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ReservationTimePicker.css';
import tdesign_film from '../../../Image/tdesign_film.svg';

function ReservationTimePicker({ onConfirm }) {
    const [pickupDate, setPickupDate] = useState(new Date());
    const [pickupTime, setPickupTime] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());
    const [returnTime, setReturnTime] = useState(new Date());
    const navigate = useNavigate();

    const handleConfirm = () => {
        onConfirm(pickupDate, pickupTime, returnDate, returnTime);
        navigate('/ReservationPage');
    };

    function blockTheDateBefore(date, interval) {
        const remainder = interval - date.getMinutes() % interval;
        const addedMinutes = remainder === interval ? 0 : remainder;
        const roundedDate = new Date(date.getTime() + addedMinutes * 60000);
        return roundedDate;
    }

    const minPickupTime = blockTheDateBefore(new Date(), 15);


    const minReturnDate = new Date(
        pickupDate.getFullYear(),
        pickupDate.getMonth(),
        pickupDate.getDate(),
        pickupDate.getHours(),
        pickupDate.getMinutes()
    );

    const minReturnTime = returnDate.toDateString() === pickupDate.toDateString() ? pickupTime : new Date().setHours(0, 0, 0, 0);

    return (
        <div className="rt-picker-container">
            <div className="rt-picker">
                <h2>Select Time Period</h2>
                <div className='rt-time'>
                    <div className="rt-time-picker">
                        <div className="rt-time-slot">
                            <div className="rt-date-input-wrapper">
                                <label>Pick Up</label>
                                <DatePicker
                                    selected={pickupDate}
                                    onChange={setPickupDate}
                                    dateFormat="MM/dd/yyyy"
                                    minDate={new Date()}
                                    wrapperClassName="date-picker"
                                />
                            </div>
                            <div className="rt-time-input-wrapper">
                                <DatePicker
                                    selected={pickupTime}
                                    onChange={setPickupTime}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    dateFormat="h:mm aa"
                                    minTime={pickupDate.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0) ? minPickupTime : new Date(0, 0, 0, 0, 0)}
                                    maxTime={new Date(0, 0, 0, 23, 45)}
                                    wrapperClassName="time-picker"
                                />
                            </div>
                        </div>
                        <div className="rt-time-slot">
                            <div className="rt-date-input-wrapper">
                                <label>Return</label>
                                <DatePicker
                                    selected={returnDate}
                                    onChange={(date) => setReturnDate(date)}
                                    dateFormat="MM/dd/yyyy"
                                    minDate={minReturnDate}
                                />
                            </div>
                            <div className="rt-time-input-wrapper">
                                <DatePicker
                                    selected={returnTime}
                                    onChange={(time) => setReturnTime(time)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    dateFormat="h:mm aa"
                                    minTime={minReturnTime}
                                    maxTime={new Date(0, 0, 0, 23, 45)}
                                    timeCaption="Time"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="rt-image-container">
                        <img src={tdesign_film} alt="film" />
                    </div>
                </div>
            </div>
            <div className="rt-button-container">
                <button className="rt-confirm-button" onClick={handleConfirm}>Confirm</button>
            </div>
        </div>
    );
}

export default ReservationTimePicker;
