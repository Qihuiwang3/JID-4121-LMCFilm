import React, { useEffect } from 'react';
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

    const orderNumber = location.state?.orderNumber || '';
   

    const reduxStudentInfo = useSelector(state => state.studentData);
    const studentInfo = location.state?.studentInfo || reduxStudentInfo;

    const selectedDates = useSelector(state => state.classData.selectedDates);

    const [pickupDateTime, setPickupDateTime] = useState(new Date(selectedDates?.pickupDateTime || new Date()));
    const [returnDateTime, setReturnDateTime] = useState(new Date(selectedDates?.returnDateTime || new Date()));


   



    useEffect(() => {

       

        const createOrder = async () => {
           

            const orderData = {
                orderNumber: orderNumber,
                email: studentInfo.email,
                checkin: pickupDateTime,
                checkout: returnDateTime,
                studentName: studentInfo.name
            };


            try {
                const response = await fetch('http://localhost:3500/api/order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });
                const data = await response.json();
                if (response.ok) {
                } else {
                    console.error('Error creating order:', data.error);
                }
            } catch (error) {
                console.error('Error submitting order:', error);
            }
        };

        createOrder();
        // set cart items to empty
        dispatch(setReservationCartItems([]));

    }, [pickupDateTime, returnDateTime, studentInfo, studentInfo.email, studentInfo.name, orderNumber]);

    // Function to handle the back button click
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

