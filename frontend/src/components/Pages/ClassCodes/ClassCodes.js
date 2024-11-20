import React, { useState, useRef } from "react";
import CodesTable from '../../Functions/CodesTable/CodesTable'; 
import Button from '../../Button/Button';
import './ClassCodes.css';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from "../../Modal/ConfirmationModal/ConfirmationModal";
import { clearAllClassCodes } from "../../../connector";

const ClassCodes = () => {
    const navigate = useNavigate();
    const [isEditMode, setIsEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
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

    const handleClearAllClassCodes = async () => {
        try {
            await clearAllClassCodes();
            if (studentTableRef.current) {
                studentTableRef.current.loadRecords(); // Call loadRecords on the child component
            }
            setShowModal(false);
        } catch (error) {
            console.error("Failed to clear all class codes:", error);
            alert("An error occurred while clearing class codes.");
        }
    };

    return (
        <div className="student-container">
            <CodesTable
                ref={studentTableRef}  
                isEditMode={isEditMode} 
                toggleEditMode={toggleEditMode} 
            /> 

            <div className="classcode-btn">
                <Button type="back" onClick={() => handleBack()}>Back</Button>
                <Button className="clearAll" type="clearAll" onClick={() => setShowModal(true)}>Clear All Codes</Button>
            </div>

            <ConfirmationModal
                show={showModal}
                onClose={() => setShowModal(false)} // Close modal on cancel
                onConfirm={handleClearAllClassCodes} // Confirm action
                title="Attention!"
                message="Clearing out all information from the database will result in serious consequences if this is not what you intend. Are you sure you want to delete it?"
            />
        </div>
    );
}

export default ClassCodes;
