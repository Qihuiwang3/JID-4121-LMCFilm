import React from 'react';
import './ReservationConfirmationMessagePage.css';
import Barcode from 'react-barcode';
import Button from '../../Button/Button';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setReservationCartItems } from '../../redux/actions/reservationCartActions';

function ReservationConfirmationMessagePage() {

    const location = useLocation();
    const orderNumber = location.state?.orderNumber || '';
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const goBack = () => {
        navigate('/Enter');
    };

    useEffect(() => {
        dispatch(setReservationCartItems([]));
    }, [])

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

