import React, { useState } from "react";
import StudentTable from '../../Functions/StudentTable/StudentTable'; 
import BackButton from '../../Button/BackButton/BackButton'; 
import CancelButton from '../../Button/CancelButton/CancelButton'; 
import './Students.css';

const Students = () => {
    const [isEditMode, setIsEditMode] = useState(false);

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode); 
    };

    return (
        <div className="student-container">
            <StudentTable isEditMode={isEditMode} toggleEditMode={toggleEditMode} /> 

            <div className="student-btn">
                {isEditMode ? (
                    <CancelButton onClick={toggleEditMode} />  
                ) : (
                    <BackButton to="/" />
                )}
            </div>
        </div>
    );
}

export default Students;
