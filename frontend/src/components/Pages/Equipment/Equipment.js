import React, { useState } from 'react';
import EquipmentPopup from '../../Modal/EquipmentPopup/EquipmentPopup';
import './Equipment.css';

const Equipment = () => {
    const [showPopup, setShowPopup] = useState(false);

    const handleOpenPopup = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div>
            <button className="add-new-button" onClick={handleOpenPopup}>
                Add New +
            </button>
            <EquipmentPopup show={showPopup} handleClose={handleClosePopup} />
        </div>
    );
};

export default Equipment;
