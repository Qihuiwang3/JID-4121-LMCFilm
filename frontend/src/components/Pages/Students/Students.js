import React, { useState, useRef } from "react";
import StudentTable from '../../Functions/StudentTable/StudentTable'; 
import BackButton from '../../Button/BackButton/BackButton'; 
import './Students.css';

const Students = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const studentTableRef = useRef(null); 

    const toggleEditMode = () => {
        if (isEditMode) {
            studentTableRef.current.loadRecords(); 
        }
        setIsEditMode(!isEditMode); 
    };

    return (
        <div className="student-container">
            <StudentTable 
                ref={studentTableRef}  
                isEditMode={isEditMode} 
                toggleEditMode={toggleEditMode} 
            /> 

            <div className="student-btn">
                <div className="bottom-btn-container">
                    <BackButton to="/Management" />
                </div>
            </div>
        </div>
    );
}

export default Students;
