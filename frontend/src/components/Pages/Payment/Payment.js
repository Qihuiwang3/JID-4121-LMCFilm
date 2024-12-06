import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PayPal from "../../Functions/PayPal/PayPal";
import './Payment.css';
import { createOrder } from '../../../connector.js';
import { connect } from 'react-redux';
import { sendEmail } from '../../../connector.js';
import JsBarcode from 'jsbarcode';


function Payment({ cartItems, selectedDates, name, email }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartTotal } = location.state || {};
    const orderCreated = useRef(false);

    const generateOrderNumber = () => {
        return 'Order-' + Math.floor(Math.random() * 1000000000);
    };
    const generateBarcodeBase64 = (orderNumber) => {
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, orderNumber, {
            format: 'CODE128',
            displayValue: false,
            width: 2,
            height: 100,
            background: '#ffffff',
            lineColor: '#000000',
            margin: 10,
        });
        return canvas.toDataURL('image/png');
    };


    const createEmail = async (orderData) => {
        try {
            const barcodeBase64 = generateBarcodeBase64(orderData.orderNumber);
            const base64Data = barcodeBase64.split(',')[1]; // 
    
           
            const emailContent = `
                <p>Here is your confirmation for your LMC order. Below is the barcode to scan for check-in:</p>
                <img src="cid:barcodeImage" alt="Order Barcode" />
            `;
    
           
            const attachments = [
                {
                    filename: 'barcode.png',
                    content: base64Data,
                    cid: 'barcodeImage', 
                    encoding: 'base64',
                    contentType: 'image/png',
                },
            ];
    
            
            await sendEmail({
                to: orderData.email,
                subject: `Order Confirmation: ${orderData.orderNumber}`,
                html: emailContent,
                attachments: attachments,
            });
    
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email.');
        }
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
                createEmail(orderData);
                navigate("/ReservationConfirmationMessagePage", { state: { orderNumber: generatedOrderNumber } });
            })
            .catch(error => {
                console.error('Error creating order:', error);
                throw error;
            });
    };

    useEffect(() => {
        if (Number(cartTotal) === 0 && !orderCreated.current) {
            // set the flag to prevent duplicate orders
            orderCreated.current = true; 
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