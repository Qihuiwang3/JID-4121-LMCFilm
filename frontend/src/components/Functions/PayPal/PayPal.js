import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { createOrder, sendEmail } from '../../../connector.js'; 
import { connect } from 'react-redux';
import JsBarcode from 'jsbarcode';

const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

const initialOptions = {
    "client-id": clientId,
    currency: "USD",
};

function Paypal({ cartTotalCost, cartItems, selectedDates, name, email }) {
    const navigate = useNavigate();

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

    const generateOrderNumber = () => {
        return 'Order-' + Math.floor(Math.random() * 1000000000);
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

        createEmail(orderData);

    
        return createOrder(orderData)
            .then(response => {
                console.log('Order created successfully:', response);
                return generatedOrderNumber; 
            })
            .catch(error => {
                console.error('Error creating order:', error);
                throw error;
            });
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                description: "Order Description",
                                amount: {
                                    currency_code: "USD",
                                    value: cartTotalCost,
                                },
                            },
                        ],
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                        console.log("Transaction completed by " + details.payer.name.given_name);

                        // Create the order and navigate to confirmation page
                        createOrderAfterPayment(cartItems, selectedDates, name, email)
                            .then(generatedOrderNumber => {
                                navigate("/ReservationConfirmationMessagePage", { state: { orderNumber: generatedOrderNumber } });
                            })
                            .catch(error => {
                                console.error("Order creation failed:", error);
                            });
                    });
                }}
            />
        </PayPalScriptProvider>
    );
}

// Map Redux state to component props
const mapStateToProps = (state) => ({
    cartItems: state.reservationCart.reservationCartItems,
    selectedDates: state.classData.selectedDates,
    email: state.studentData.email, 
    name: state.studentData.name, 
});

// Connect the component to Redux
export default connect(mapStateToProps)(Paypal);
