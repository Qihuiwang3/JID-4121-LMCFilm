import React, { useState, useRef } from "react";
import BackButton from '../../Button/BackButton/BackButton'; 
import DamageTable from "../../Functions/DamageTable/DamageTable";
import './DamageReport.css';

const DamageReport = () => {
    const damageTableRef = useRef(null); 

    return (
        <div className="damage-container">
            <DamageTable 
                ref={damageTableRef}  
                isEditMode={true} 
            /> 

            <div className="damage-btn">
                <BackButton to="/ViewEquipment" />
            </div>
        </div>
    );
}

export default DamageReport;
