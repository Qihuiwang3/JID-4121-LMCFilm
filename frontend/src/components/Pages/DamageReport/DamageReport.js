import React, { useState, useRef } from "react";
import Button from "../../Button/Button";
import DamageTable from "../../Functions/DamageTable/DamageTable";
import './DamageReport.css';
import { useNavigate } from 'react-router-dom';

const DamageReport = () => {
    const damageTableRef = useRef(null); 
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/ViewEquipment');
    };

    return (
        <div className="damage-container">
            <DamageTable 
                ref={damageTableRef}  
                isEditMode={true} 
            /> 

            <div className="damage-btn">
                <Button type="back" onClick={() => handleBack()}>Back</Button>
            </div>
        </div>
    );
}

export default DamageReport;
