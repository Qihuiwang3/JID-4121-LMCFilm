import React, { useState, useRef } from "react";
import BackButton from '../../Button/BackButton/BackButton'; 
import CancelButton from '../../Button/CancelButton/CancelButton'; 
import SaveButton from '../../Button/SaveButton/SaveButton'; 
import DamageTable from "../../Functions/DamageTable/DamageTable";
import './DamageReport.css';

const DamageReport = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const damageTableRef = useRef(null); 

    const toggleEditMode = () => {
        if (isEditMode) {
            damageTableRef.current.loadRecords(); 
        }
        setIsEditMode(!isEditMode); 
    };

    const handleSave = async () => {
        if (damageTableRef.current) {
            await damageTableRef.current.saveChanges(); 
        }
        toggleEditMode();
    };

    return (
        <div className="damage-container">
            <DamageTable 
                ref={damageTableRef}  
                isEditMode={isEditMode} 
                toggleEditMode={toggleEditMode} 
            /> 

            <div className="damage-btn">
                {isEditMode ? (
                    <div className="bottom-btn-container">
                        <CancelButton onClick={toggleEditMode} />  
                        <SaveButton onClick={handleSave} />
                    </div>
                ) : (
                    <div className="bottom-btn-container">
                        <BackButton to="/ViewEquipment" />
                    </div>
                )}
            </div>
        </div>
    );
}

export default DamageReport;
