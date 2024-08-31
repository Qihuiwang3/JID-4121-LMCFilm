import React from 'react';
import PayPal from "../../Functions/PayPal/PayPal";
import './Payment.css'; 

function Payment() {
    return (
        <div className="paymentBody">
            <div className='paymentContainer'>
                <PayPal />
            </div>
        </div >
    );

}

export default Payment;