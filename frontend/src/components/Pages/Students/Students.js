import React, { useState, useRef } from "react";
import StudentTable from '../../Functions/StudentTable/StudentTable'; 
import BackButton from '../../Button/BackButton/BackButton'; 
import CancelButton from '../../Button/CancelButton/CancelButton'; 
import SaveButton from '../../Button/SaveButton/SaveButton'; 
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

    const handleSave = async () => {
        if (studentTableRef.current) {
            await studentTableRef.current.saveChanges(); 
        }
        toggleEditMode();
    };

    return (
        <div className="student-container">
            <StudentTable 
                ref={studentTableRef}  
                isEditMode={isEditMode} 
                toggleEditMode={toggleEditMode} 
            /> 

            <div className="student-btn">
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

export default Students;
