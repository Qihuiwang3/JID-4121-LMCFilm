import React, { Component } from 'react';
import './ReservationConfirmationMessagePage.css';
import Barcode from 'react-barcode';
import Button from '../../Button/Button';
import { createOrder } from '../../../connector.js';
import { connect } from 'react-redux'; // To connect to Redux

class ReservationConfirmationMessagePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderNumber: ''
        };
    }

    // Method to generate the order number
    generateOrderNumber = () => {
        return 'Order-' + Math.floor(Math.random() * 1000000000);
    };

    // Lifecycle method - called once when component mounts
    componentDidMount() {
        const generatedOrderNumber = this.generateOrderNumber();
        this.setState({ orderNumber: generatedOrderNumber });

        // Get cartItems from Redux
        const { cartItems } = this.props;

        // Call createOrder only once when the component mounts
        const orderData = {
            orderNumber: generatedOrderNumber,
            email: "student@example.com", // Replace with actual email or dynamic value
            checkin: "2024-09-12T10:00:00Z", // Replace with actual checkin date
            checkout: "2024-09-18T10:00:00Z", // Replace with actual checkout date
            checkedin: "2024-10-12T10:00:00Z", // Replace with actual checked-in date
            checkedout: "2024-10-18T10:00:00Z", // Replace with actual checked-out date
            checkedinStatus: true, // Set the check-in status to true
            checkedoutStatus: true, // Set the check-out status to true
            studentName: "John Doe", // Replace with actual student name
            createdAt: "2024-09-10T09:00:00Z", // Replace with the correct creation date
            equipment: cartItems.map(item => item.name), // Use cartItems from Redux
        };

        createOrder(orderData)
            .then(response => {
                console.log('Order created successfully:', response);
            })
            .catch(error => {
                console.error('Error creating order:', error);
            });
    }

    // Function to handle the back button click
    goBack = () => {
        this.props.history.push('/Enter');
    };

    render() {
        const { orderNumber } = this.state;

        return (
            <div className="main-content">
                <h1 className='select-class-header'>
                    Your Reservation has been confirmed!
                </h1>
                <div className='confirm-text'>
                    Here is your QR Code for pickup and return purposes. You can also find this QR code under Profile.
                </div>

                <div className="barcode-container">
                    <Barcode value={orderNumber} />
                </div>
                <div className="btnContainer">
                    <Button type="back" onClick={this.goBack}>Back</Button>
                </div>
            </div>
        );
    }
}

// Map Redux state to component props
const mapStateToProps = (state) => ({
    cartItems: state.reservationCart.reservationCartItems,
});

export default connect(mapStateToProps)(ReservationConfirmationMessagePage);
