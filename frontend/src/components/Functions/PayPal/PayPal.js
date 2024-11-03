import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";
import { createOrder } from '../../../connector.js';
import { connect } from 'react-redux';

const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

const initialOptions = {
    "client-id": clientId,
    currency: "USD",
};

function Paypal({ cartTotalCost, cartItems, selectedDates, name, email }) {
    const navigate = useNavigate();

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
            equipment: cartItems,
        };

        console.log("order data ITEMS");
        console.log(orderData);

        // Call createOrder API
        return createOrder(orderData)
            .then(response => {
                console.log('Order created successfully:', response);
                return generatedOrderNumber; // Return the generated order number
            })
            .catch(error => {
                console.error('Error creating order:', error);
                throw error;
            });
    };

    return (
        <>
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    description: "Cool looking table",
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

            {/* button to skip payment and go to confirmation page */}

            {/* <button onClick={() => {
                createOrderAfterPayment(cartItems, selectedDates, name, email)
                    .then(generatedOrderNumber => {
                        navigate("/ReservationConfirmationMessagePage", { state: { orderNumber: generatedOrderNumber } });
                    })
                    .catch(error => {
                        console.error("Order creation failed:", error);
                    });
            }}>CHEAT BUTTON</button> */}
        </>

    );
}

// Map Redux state to component props
const mapStateToProps = (state) => ({
    cartItems: state.reservationCart.reservationCartItems,
    selectedDates: state.classData.selectedDates, // Assuming selectedDates is in classData
    email: state.studentData.email,
    name: state.studentData.name,
});

// Connect the component to Redux
export default connect(mapStateToProps)(Paypal);

