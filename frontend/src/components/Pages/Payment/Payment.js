import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PayPal from "../../Functions/PayPal/PayPal";
import './Payment.css';
import { createOrder } from '../../../connector.js';
import { connect } from 'react-redux';

function Payment({ cartItems, selectedDates, name, email }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartTotal } = location.state || {};

    const generateOrderNumber = () => {
        return 'Order-' + Math.floor(Math.random() * 1000000000);
    };

    const createOrderAfterPayment = (cartItems, selectedDates, name, email) => {
        const generatedOrderNumber = generateOrderNumber();

        const orderData = {
            orderNumber: generatedOrderNumber,
            email: email,
            checkin: selectedDates.pickupDateTime,
            checkout: selectedDates.returnDateTime,
            checkedin: null,
            checkedout: null,
            checkedinStatus: false,
            checkedoutStatus: false,
            studentName: name,
            createdAt: new Date(),
            equipment: cartItems.map(item => ({
                itemName: item.name, 
                itemId: '' 
            })),
        };

        return createOrder(orderData)
            .then(response => {
                console.log('Order created successfully:', response);
                navigate("/ReservationConfirmationMessagePage", { state: { orderNumber: generatedOrderNumber } });
            })
            .catch(error => {
                console.error('Error creating order:', error);
                throw error;
            });
    };

    useEffect(() => {
        if (Number(cartTotal) === 0) {
            createOrderAfterPayment(cartItems, selectedDates, name, email);
        }
    }, [cartTotal, cartItems, selectedDates, name, email, navigate]);

    return (
        <div className="paymentBody">
            <div className='paymentContainer'>
                {cartTotal > 0 && <PayPal cartTotalCost={cartTotal} />}
            </div>
        </div>
    );
}

const mapStateToProps = (state) => ({
    cartItems: state.reservationCart.reservationCartItems,
    selectedDates: state.classData.selectedDates,
    email: state.studentData.email,
    name: state.studentData.name,
});

export default connect(mapStateToProps)(Payment); 
