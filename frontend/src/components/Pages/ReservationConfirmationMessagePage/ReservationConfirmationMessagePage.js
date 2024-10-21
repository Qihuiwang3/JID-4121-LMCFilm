import React, { useState, useEffect } from 'react';
import './ReservationConfirmationMessagePage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Barcode from 'react-barcode';
import Button from '../../Button/Button';


function ReservationConfirmationMessagePage() {
    const [orderNumber, setOrderNumber] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
   

    const reduxStudentInfo = useSelector(state => state.studentData);
    const studentInfo = location.state?.studentInfo || reduxStudentInfo;

    const selectedDates = useSelector(state => state.classData.selectedDates);

    const [pickupDateTime, setPickupDateTime] = useState(new Date(selectedDates?.pickupDateTime || new Date()));
    const [returnDateTime, setReturnDateTime] = useState(new Date(selectedDates?.returnDateTime || new Date()));


    const generateOrderNumber = () => {
        return 'Order-' + Math.floor(Math.random() * 1000000000);
    };



    useEffect(() => {

        const generatedOrderNumber = generateOrderNumber();
        setOrderNumber(generatedOrderNumber);

        const createOrder = async () => {
            const generatedOrderNumber = generateOrderNumber();
            setOrderNumber(generatedOrderNumber);

            const orderData = {
                orderNumber: generatedOrderNumber,
                email: studentInfo.email,
                checkin: pickupDateTime,
                checkout: returnDateTime,
                studentName: studentInfo.name
            };

            console.log(orderData);

            try {
                const response = await fetch('http://localhost:3500/api/order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                const data = await response.json();
                if (response.ok) {
                    console.log('Order created successfully:', data);
                } else {
                    console.error('Error creating order:', data.error);
                }
            } catch (error) {
                console.error('Error submitting order:', error);
            }
        };

        createOrder();

    }, [pickupDateTime, returnDateTime, studentInfo, studentInfo.email, studentInfo.name, setOrderNumber]);

    // Function to handle the back button click

    const goBack = () => {
        navigate('/Enter');
    };

    return (
        <div className="main-content">
            <h1 className='select-class-header'>
                {orderNumber ? 'Your Reservation has been confirmed!' : 'Error, there\'s something wrong when making the order.'}
            </h1>

            {orderNumber && (
                <>
                    <div className='confirm-text'>
                        Here is your QR Code for pickup and return purposes. You can also find this QR code under Profile.
                    </div>

                    <div className="barcode-container">
                        <Barcode value={orderNumber} />
                    </div>
                </>
            )}

            <div className="btnContainer">
                <Button type="back" onClick={goBack}>Back</Button>
            </div>
        </div>
    );
}


export default ReservationConfirmationMessagePage;
