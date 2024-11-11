import React, { useRef, useState } from "react";
import ReservationTable from '../../Functions/ReservationTable/ReservationTable'; 
import Button from '../../Button/Button';
import './ViewReservation.css';
import { useNavigate } from 'react-router-dom';
import { sendEmail } from "../../../connector";
import SendAnnounce from "../../Modal/SendAnnounce/SendAnnounce";

const ViewReservation = () => {
    const navigate = useNavigate();
    const studentTableRef = useRef(null); 
    const [viewSendId, setViewSendId] = useState(null);

    const handleBack = () => {
        navigate('/SelectTask');
    };

    const sendAnnouncement = () => {
        setViewSendId(true);
    };

    // Close handler to hide the SendAnnounce modal
    const handleClose = () => {
        setViewSendId(null);
    };

    return (
        <>
            <div className="reservation-container">
                <ReservationTable 
                    ref={studentTableRef}  
                /> 

                <div className="reservation-btn">
                    <div className="bottom-btn-container">
                        <Button type="back" onClick={handleBack}>Back</Button>
                        <button className="rh-btn-send-announcement" onClick={sendAnnouncement}>Send Announcement</button>
                    </div>
                </div>
            </div>

            {viewSendId && (
                <SendAnnounce
                    show={!!viewSendId} 
                    handleClose={handleClose} // Pass the handleClose function to the modal
                />
            )}
        </>
    );
}

export default ViewReservation;
