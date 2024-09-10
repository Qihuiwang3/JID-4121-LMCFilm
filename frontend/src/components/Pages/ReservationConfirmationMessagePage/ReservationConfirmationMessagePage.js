import React, { useEffect, useState } from 'react';
import './ReservationConfirmationMessagePage.css';
import { useNavigate } from 'react-router-dom';
import Barcode from 'react-barcode';

function ReservationConfirmationMessagePage() {
    const [orderNumber, setOrderNumber] = useState('');
    const navigate = useNavigate();

    const generateOrderNumber = () => {
        return 'Order-' + Math.floor(Math.random() * 1000000000);
    };

    useEffect(() => {
        const generatedOrderNumber = generateOrderNumber();
        setOrderNumber(generatedOrderNumber);
        
            const cartTotal = calculateTotal();
                const templateParams = {
                    to_email: 'charlesdickens2424@outlook.com',
                    subject: 'Order Confirmation',
                    message: `You have a new order. Total: ${cartTotal}`
                };
           
           
                emailjs.send('service_ydtf7yr', 'template_necdynr', templateParams, 'FqA2gtqDtehYJomld')
                    .then((response) => {
                        console.log('Email sent successfully:', response);
                    })
                    .catch((error) => {
                        console.error('Error sending email:', error);
                    });
           
            navigate('/Payment', { state: { cartTotal } });
        
    
    }, []);

    // Function to handle the back button click
    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="confirmation-container">
            <div className='header_text'>
                Your Reservation has been confirmed!
            </div>
            <div className='confirm-text'>
                Here is your QR Code for pickup and return purposes. You can also find this QR code under Profile.
            </div>

            <div className="barcode-container">
                {/* Render the barcode with the order number */}
                <Barcode value={orderNumber} />
            </div>
            <button className="back-button">Back</button>
        </div>

    );
}

export default ReservationConfirmationMessagePage;