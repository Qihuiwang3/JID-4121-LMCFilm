import React, { useState, useRef } from 'react';
import EquipmentPopup from '../../Modal/EquipmentPopup/EquipmentPopup';
import './Equipment.css';

import BackButton from '../../Button/BackButton/BackButton';
import CancelButton from '../../Button/CancelButton/CancelButton';
import SaveButton from '../../Button/SaveButton/SaveButton';
import EquipmentTable from '../../Functions/EquipmentTable/EquipmentTable'

const Equipment = () => {
    const [showPopup, setShowPopup] = useState(false);

    const [isEditMode, setIsEditMode] = useState(false);
    const equipmentTableRef = useRef(null);

    const toggleEditMode = () => {
        if (isEditMode) {
            equipmentTableRef.current.loadRecords();
        }
        setIsEditMode(!isEditMode);
    };

    const handleSave = async () => {
        if (equipmentTableRef.current) {
            await equipmentTableRef.current.saveChanges();
        }
        toggleEditMode();
    };

    const handleOpenPopup = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div>
            <EquipmentTable
                ref={equipmentTableRef}
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
                        <BackButton to="/" />
                    </div>
                )}
            </div>

            <button className="add-new-button" onClick={handleOpenPopup}>
                Add New +
            </button>
            <EquipmentPopup show={showPopup} handleClose={handleClosePopup} />
        </div>
    );
};

export default Equipment;
