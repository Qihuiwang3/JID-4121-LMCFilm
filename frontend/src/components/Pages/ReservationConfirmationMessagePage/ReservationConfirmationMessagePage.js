import React, { useEffect, useState } from 'react';
import './ReservationConfirmationMessagePage.css';
import { useNavigate } from 'react-router-dom';
import Barcode from 'react-barcode';
import emailjs from 'emailjs-com';


function ReservationConfirmationMessagePage() {
    const [orderNumber, setOrderNumber] = useState('');
    const navigate = useNavigate();

    const generateOrderNumber = () => {
        return 'Order-' + Math.floor(Math.random() * 1000000000);
    };

    const sendEmail = (OrderNumber) => {
        //const studentName = "John Doe"; // Replace with the actual student name or a dynamic value
    
        //const student = fetch(`http://localhost:3500/api/students/${studentName}`); Uncommit for backend, dont have actual email for students yet to test on 
       
        const templateParams = {
            to_email: 'charlesDickens2424@outlook.com',
            subject: OrderNumber,
            message: 'You have a new order and Equipment to Reserve'
        };
        emailjs.send('service_ydtf7yr', 'template_necdynr', templateParams, 'FqA2gtqDtehYJomld')    
            .then((response) => {
                console.log('Email sent successfully:', response);
            })
            .catch((error) => {
                console.log('Error sending email:', error);
            });
    
};

    useEffect(() => {
        const generatedOrderNumber = generateOrderNumber();
        sendEmail(generateOrderNumber)
        setOrderNumber(generatedOrderNumber);
    
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
