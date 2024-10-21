import React, { useState, useRef } from "react";
import StudentTable from '../../Functions/StudentTable/StudentTable'; 
import Button from '../../Button/Button';
import './Students.css';
import { useNavigate } from 'react-router-dom';

const Students = () => {
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);
    const studentTableRef = useRef(null); 

    const toggleEditMode = () => {
        if (isEditMode) {
            studentTableRef.current.loadRecords(); 
        }
        setIsEditMode(!isEditMode); 
    };

    const handleBack = () => {
        navigate('/Management');
    };

    return (
        <div className="student-container">
            <StudentTable 
                ref={studentTableRef}  
                isEditMode={isEditMode} 
                toggleEditMode={toggleEditMode} 
            /> 

            <div className="student-btn">
                <Button type="back" onClick={() => handleBack()}>Back</Button>
            </div>
        </div>
    );
}

export default Students;
