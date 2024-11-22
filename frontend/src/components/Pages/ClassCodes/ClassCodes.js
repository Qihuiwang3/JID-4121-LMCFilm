import React, { useState, useRef } from "react";
import CodesTable from '../../Functions/CodesTable/CodesTable'; 
import Button from '../../Button/Button';
import './ClassCodes.css';
import { useNavigate } from 'react-router-dom';

const ClassCodes = () => {
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
            <CodesTable
                ref={studentTableRef}  
                isEditMode={isEditMode} 
                toggleEditMode={toggleEditMode} 
            /> 

            <div className="classCode-btn">
                <div className="bottom-btn-container">
                    <Button type="back" onClick={() => handleBack()}>Back</Button>
                </div>
            </div>
        </div>
    );
}

export default ClassCodes;
