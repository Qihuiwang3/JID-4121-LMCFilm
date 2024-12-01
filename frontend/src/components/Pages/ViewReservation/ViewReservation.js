import React, { useRef } from "react";
import ReservationTable from '../../Functions/ReservationTable/ReservationTable'; 
import Button from '../../Button/Button';
import './ViewReservation.css';
import { useNavigate } from 'react-router-dom';

const ViewReservation = () => {
    const navigate = useNavigate();
    const studentTableRef = useRef(null); 
    const handleBack = () => {
        navigate('/SelectTask');
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default ViewReservation;
