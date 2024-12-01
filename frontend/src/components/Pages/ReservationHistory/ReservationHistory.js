import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReservationHistoryTable from '../../Functions/ReservationHistoryTable/ReservationHistoryTable';
import BackButton from '../../Button/BackButton/BackButton';
import './ReservationHistory.css'
import SendAnnounce from "../../Modal/SendAnnounce/SendAnnounce";

function ReservationHistory() {

    const location = useLocation();
    const reduxStudentInfo = useSelector(state => state.studentData);
    const studentInfo = location.state?.studentInfo || reduxStudentInfo;
    const [viewSendId, setViewSendId] = useState(null);


    const sendAnnouncement = () => {
        setViewSendId(true);
    };

    // Close handler to hide the SendAnnounce modal
    const handleClose = () => {
        setViewSendId(null);
    };

    return (
        <div>

            <ReservationHistoryTable>

            </ReservationHistoryTable>

            <div className="equipment-btn">
                <div className="rh-bottom-btn-container">
                    <BackButton to={-1} />

                    {studentInfo.role === "Admin" && (
                        <button className="rh-btn-send-announcement" onClick={sendAnnouncement}> Send Announcement</button>
                    )}

                </div>
            </div>

            {viewSendId && (
                <SendAnnounce
                    show={!!viewSendId} 
                    handleClose={handleClose} // Pass the handleClose function to the modal
                />
            )}

        </div>
    )
}

export default ReservationHistory;