import React, { useState, useRef } from 'react';
import EquipmentPopup from '../../Modal/EquipmentPopup/EquipmentPopup';

import BackButton from '../../Button/BackButton/BackButton';
import EquipmentTable from '../../Functions/EquipmentTable/EquipmentTable';

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
                <div className="equipment-bottom-btn-container">
                        <BackButton to="/ViewEquipment" />
                </div>
            </div>

            <EquipmentPopup show={showPopup} handleClose={handleClosePopup} />
        </div>
    );
};

export default Equipment;
