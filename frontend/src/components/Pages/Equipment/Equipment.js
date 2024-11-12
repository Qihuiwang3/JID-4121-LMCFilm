import React, { useState, useRef } from 'react';
import EquipmentAddPopup from '../../Modal/EquipmentPopup/EquipmentAddPopup';
import EquipmentUpdatePopup from '../../Modal/EquipmentPopup/EquipmentUpdatePopup'; // Import the update popup
import BackButton from '../../Button/BackButton/BackButton';
import EquipmentTable from '../../Functions/EquipmentTable/EquipmentTable';

const Equipment = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [showUpdatePopup, setShowUpdatePopup] = useState(false); // State for update popup
    const [selectedItem, setSelectedItem] = useState(null); // State to hold selected item data

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

    const handleOpenUpdatePopup = (itemData) => {
        setSelectedItem(itemData); // Set the selected item data to pass to the update modal
        setShowUpdatePopup(true); // Show the update popup
    };

    const handleCloseUpdatePopup = () => {
        setShowUpdatePopup(false);
        setSelectedItem(null); // Clear selected item data when closing
    };

    const refreshTableData = () => {
        if (equipmentTableRef.current) {
            equipmentTableRef.current.loadRecords();
        }
    };

    return (
        <div>
            <EquipmentTable
                ref={equipmentTableRef}
                isEditMode={isEditMode}
                toggleEditMode={toggleEditMode}
                handleOpenPopup={handleOpenPopup}
                handleOpenUpdatePopup={handleOpenUpdatePopup} // Pass down to handle row icon click
            />

            <div className="equipment-btn">
                <div className="equipment-bottom-btn-container">
                    <BackButton to="/ViewEquipment" />
                </div>
            </div>

            {/* Render Add Popup */}
            <EquipmentAddPopup show={showPopup} handleClose={handleClosePopup} />

            {/* Render Update Popup with selected data */}
            <EquipmentUpdatePopup
                show={showUpdatePopup}
                handleClose={handleCloseUpdatePopup}
                existingData={selectedItem} // Pass the selected item data to the update popup
                onUpdateComplete={refreshTableData} // Pass the callback function
            />
        </div>
    );
};

export default Equipment;

