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
            orderNumber: '',
            orderError: false,
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

        const { cartItems, selectedDates, name, email } = this.props;

        const orderData = {
            orderNumber: generatedOrderNumber,
            email: email, // Replace with actual email or dynamic value
            checkin: selectedDates.pickupDateTime, // Use selected pickupDateTime or default to current date
            checkout: selectedDates.returnDateTime, // Use selected returnDateTime or default to current date
            checkedin: null, // Default to null, as the user hasn't checked in yet
            checkedout: null, // Default to null, as the user hasn't checked out yet
            checkedinStatus: false, // Set the check-in status to false
            checkedoutStatus: false, // Set the check-out status to false
            studentName: name, // Replace with actual student name
            createdAt: new Date(), // Current date
            equipment: cartItems.map(item => item.name), // Use cartItems from Redux
        };

        createOrder(orderData)
            .then(response => {
                const generatedOrderNumber = this.generateOrderNumber();
                this.setState({ orderNumber: generatedOrderNumber, orderError: false });
                console.log('Order created successfully:', response);
            })
            .catch(error => {
                this.setState({ orderError: true }); 
                console.error('Error creating order:', error);
            });
    }

    // Function to handle the back button click
    goBack = () => {
        this.props.history.push('/Enter');
    };

    render() {
        const { orderNumber, orderError } = this.state;

        return (
            <div className="main-content">
                <h1 className='select-class-header'>
                    {orderError ? 'Error, there\'s something wrong when making the order.' : 'Your Reservation has been confirmed!'}
                </h1>

                {!orderError && (
                    <>
                        <div className='confirm-text'>
                            Here is your QR Code for pickup and return purposes. You can also find this QR code under Profile.
                        </div>

                        <div className="barcode-container">
                            <Barcode value={orderNumber} />
                        </div>
                    </>
                )}

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
    selectedDates: state.classData.selectedDates, // Assuming selectedDates is in classData
    email: state.studentData.email, 
    name: state.studentData.name, 
});

export default connect(mapStateToProps)(ReservationConfirmationMessagePage);
