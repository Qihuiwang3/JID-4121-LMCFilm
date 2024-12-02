import React from 'react';
import './ReservationConfirmationMessagePage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Barcode from 'react-barcode';
import Button from '../../Button/Button';


function ReservationConfirmationMessagePage() {

    const location = useLocation();
    const navigate = useNavigate();

    const orderNumber = location.state?.orderNumber || '';
   

    // Function to handle the back button click
    const goBack = () => {
        navigate('/Enter');
    };

    return (
        <div className="main-content">
            <h1 className='select-class-header'>
                {orderNumber ? 'Your Reservation has been confirmed!' : 'Error, there\'s something wrong when making the order.'}
            </h1>

            {orderNumber && (
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
                <Button type="back" onClick={goBack}>Back</Button>
            </div>
        </div>
    );
}


export default ReservationConfirmationMessagePage;