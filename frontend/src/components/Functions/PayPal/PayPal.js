import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";



const clientId = process.env.REACT_APP_PAYPAL_CLIENT_ID;

const initialOptions = {
    "client-id": clientId,
    currency: "USD",
};

function Payment({ cartTotalCost }) {
    return (
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                description: "Cool looking table",
                                amount: {
                                    currency_code: "USD",
                                    value: { cartTotalCost },
                                },
                            },
                        ],
                    });
                }}
                onApprove={(data, actions) => {
                    return actions.order.capture().then((details) => {
                        console.log("Transaction completed by " + details.payer.name.given_name);
                    });
                }}
            />
        </PayPalScriptProvider>
    );
}

export default Payment;
