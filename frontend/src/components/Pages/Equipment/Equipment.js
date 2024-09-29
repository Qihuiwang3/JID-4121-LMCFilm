import React, { useState, useRef } from 'react';
import EquipmentPopup from '../../Modal/EquipmentPopup/EquipmentPopup';

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
                handleOpenPopup={handleOpenPopup}
            />

            <div className="equipment-btn">
                {isEditMode ? (
                    <div className="equipment-bottom-btn-container">
                        <CancelButton onClick={toggleEditMode} />
                        <SaveButton onClick={handleSave} />
                    </div>
                ) : (
                    <div className="equipment-bottom-btn-container">
                        <BackButton to="/SelectTask" />
                    </div>
                )}
            </div>

            <EquipmentPopup show={showPopup} handleClose={handleClosePopup} />
        </div>
    );
};

export default Equipment;
