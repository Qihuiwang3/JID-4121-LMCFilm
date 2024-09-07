import React from 'react';
import { useLocation } from 'react-router-dom';
import PayPal from "../../Functions/PayPal/PayPal";
import './Payment.css';
import emailjs from 'emailjs-com';

function Payment() {

    const location = useLocation();
    const { cartTotal } = location.state || {};


    const sendEmail = () => {
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
    };

    
    return (
        <div className="paymentBody">
            <div className='paymentContainer'>
                <PayPal cartTotalCost={cartTotal} />
            </div>
            <button className="confirmBtn2" onClick={sendEmail}>Automated Email Test</button>
        </div >
    );
    

}





export default Payment;