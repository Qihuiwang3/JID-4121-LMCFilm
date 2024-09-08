import React from 'react';
import { useLocation } from 'react-router-dom';
import PayPal from "../../Functions/PayPal/PayPal";
import './Payment.css';

function Payment() {

    const location = useLocation();
    const { cartTotal } = location.state || {};

    return (
        <div className="paymentBody">
            <div className='paymentContainer'>
                <PayPal cartTotalCost={cartTotal} />
            </div>
        </div >
    );

}

export default Payment;