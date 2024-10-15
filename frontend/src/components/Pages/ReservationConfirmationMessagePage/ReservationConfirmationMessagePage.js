import React, { useEffect, useState } from 'react';
import './ReservationConfirmationMessagePage.css';
import { useNavigate } from 'react-router-dom';
import Barcode from 'react-barcode';
import emailjs from 'emailjs-com';
import Button from '../../Button/Button';

function ReservationConfirmationMessagePage() {
    const [orderNumber, setOrderNumber] = useState('');
    const navigate = useNavigate();

    const generateOrderNumber = () => {
        return 'Order-' + Math.floor(Math.random() * 1000000000);
    };

    const send = async (generatedOrderNumber) => {
        await sendEmail('test', generatedOrderNumber, 'test');
    };

    useEffect(() => {
        const generatedOrderNumber = generateOrderNumber();
        send(generatedOrderNumber);
        setOrderNumber(generatedOrderNumber);
        // createOrder();
    }, []);

    // Function to handle the back button click
    const goBack = () => {
        navigate('/Enter');
    };

    return (
        <div className="main-content">
            <h1 className='select-class-header'>
                Your Reservation has been confirmed!
            </h1>
            <div className='confirm-text'>
                Here is your QR Code for pickup and return purposes. You can also find this QR code under Profile.
            </div>

            <div className="barcode-container">
                {/* Render the barcode with the order number */}
                <Barcode value={orderNumber} />
            </div>
            <div className="btnContainer">
                <Button type="back" onClick={goBack}>Back</Button>
            </div>
        </div>

    );
}

export default ReservationConfirmationMessagePage;
