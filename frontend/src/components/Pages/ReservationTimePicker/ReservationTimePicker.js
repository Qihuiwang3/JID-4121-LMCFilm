import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDates } from '../../redux/actions/classActions';
import 'react-datepicker/dist/react-datepicker.css';
import './ReservationTimePicker.css';
import tdesign_film from '../../../Image/tdesign_film.svg';
import Button from '../../Button/Button';

function ReservationTimePicker() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const classCode = useSelector((state) => state.classData.classCode);
    const selectedDates = useSelector(state => state.classData.selectedDates);

    const pickupDateTime = new Date(selectedDates?.pickupDateTime || Date.now());
    const returnDateTime = new Date(selectedDates?.returnDateTime || Date.now());

    const [pickupDate, setPickupDate] = useState(new Date(pickupDateTime.getFullYear(), pickupDateTime.getMonth(), pickupDateTime.getDate()));
    const [pickupTime, setPickupTime] = useState(new Date(pickupDateTime));
    const [returnDate, setReturnDate] = useState(new Date(returnDateTime.getFullYear(), returnDateTime.getMonth(), returnDateTime.getDate()));
    const [returnTime, setReturnTime] = useState(new Date(returnDateTime));

    const handleConfirm = () => {
        const combinedPickupDateTime = new Date(
            pickupDate.getFullYear(),
            pickupDate.getMonth(),
            pickupDate.getDate(),
            pickupTime.getHours(),
            pickupTime.getMinutes()
        );

        const combinedReturnDateTime = new Date(
            returnDate.getFullYear(),
            returnDate.getMonth(),
            returnDate.getDate(),
            returnTime.getHours(),
            returnTime.getMinutes()
        );

        dispatch(setSelectedDates(combinedPickupDateTime, combinedReturnDateTime));

        navigate('/ReservationPage');
    };

    const handleBack = () => {
        navigate('/SelectClass', { state: { classCode } });
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

    const handlePickupDateChange = (newPickupDate) => {
        setPickupDate(newPickupDate);

        const newReturnDate = new Date(newPickupDate);
        newReturnDate.setDate(newPickupDate.getDate() + 1); 
        setReturnDate(newReturnDate);

        setReturnTime(new Date(newReturnDate.getFullYear(), newReturnDate.getMonth(), newReturnDate.getDate(), 9, 0)); 
    };

    const minReturnTime = returnDate.toDateString() === pickupDate.toDateString() ? pickupTime : new Date().setHours(0, 0, 0, 0);

    const maxPickupDate = new Date();
    maxPickupDate.setDate(maxPickupDate.getDate() + 5);

    const getMaxReturnDate = () => {
        const maxReturn = new Date(pickupDate);
        maxReturn.setDate(maxReturn.getDate() + 5);
        return maxReturn;
    };

    return (
        <div className="main-content">
            <h1 className="select-class-header">Select Time Period</h1>
            <div className="rt-picker">
                <div className='rt-time'>
                    <div className="rt-time-picker">
                        <div className="rt-time-slot">
                            <div className="rt-date-input-wrapper">
                                <label>Pick Up</label>
                                <DatePicker
                                    selected={pickupDate}
                                    onChange={handlePickupDateChange}
                                    dateFormat="MM/dd/yyyy"
                                    minDate={new Date()}
                                    maxDate={maxPickupDate}
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
                                    maxDate={getMaxReturnDate()}
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
            <div className="btnContainer">
                <Button type="back" onClick={handleBack}>Back</Button>
                <Button type="next" onClick={handleConfirm}>Confirm</Button>
            </div>
        </div>
    );
}

export default ReservationTimePicker;
