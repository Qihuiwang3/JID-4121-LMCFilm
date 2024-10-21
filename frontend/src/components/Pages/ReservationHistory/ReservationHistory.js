import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReservationHistoryTable from '../../Functions/ReservationHistoryTable/ReservationHistoryTable';
import BackButton from '../../Button/BackButton/BackButton';
import './ReservationHistory.css'

function ReservationHistory() {

    const location = useLocation();
    const reduxStudentInfo = useSelector(state => state.studentData);
    const studentInfo = location.state?.studentInfo || reduxStudentInfo;

    return (
        <div>

            <ReservationHistoryTable>

            </ReservationHistoryTable>

            <div className="equipment-btn">
                <div className="rh-bottom-btn-container">
                    <BackButton to={studentInfo.role === "Admin" ? "/SelectTask" : "/Reservation"} />

                    {studentInfo.role === "Admin" && (
                        <button className="rh-btn-send-announcement"> Send Announcement</button>
                    )}

                </div>
            </div>

        </div>
    )
}

export default ReservationHistory;