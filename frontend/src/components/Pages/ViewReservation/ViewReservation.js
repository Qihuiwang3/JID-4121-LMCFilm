import React, { useState, useRef } from "react";
import ReservationTable from '../../Functions/ReservationTable/ReservationTable'; 
import BackButton from '../../Button/BackButton/BackButton'; 
import CancelButton from '../../Button/CancelButton/CancelButton'; 
import SaveButton from '../../Button/SaveButton/SaveButton'; 
import './ViewReservation.css';

const ViewReservation = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const studentTableRef = useRef(null); 

    const toggleEditMode = () => {
        if (isEditMode) {
            studentTableRef.current.loadRecords(); 
        }
        setIsEditMode(!isEditMode); 
    };

    const handleSave = async () => {
        if (studentTableRef.current) {
            await studentTableRef.current.saveChanges(); 
        }
        toggleEditMode();
    };

    return (
        <div className="reservation-container">
            <ReservationTable 
                ref={studentTableRef}  
                isEditMode={isEditMode} 
                toggleEditMode={toggleEditMode} 
            /> 

            <div className="reservation-btn">
                {isEditMode ? (
                    <div className="bottom-btn-container">
                        <CancelButton onClick={toggleEditMode} />  
                        <SaveButton onClick={handleSave} />
                    </div>
                ) : (
                    <div className="bottom-btn-container">
                        <BackButton to="/Management" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ViewReservation;
