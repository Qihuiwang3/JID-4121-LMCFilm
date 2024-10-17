import React from 'react';
import './ScanButton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';

const ScanButton = ({ isScanMode, onClick }) => {
    if (isScanMode) {
        return null; // Do not render the Scan button in scan mode
    }

    return (
        <div onClick={onClick}>
            <button className="scan-btn">
                Scan
                <FontAwesomeIcon icon={faExpand} className="scan-btn-icon" />
            </button>
        </div>
    );
};


export default ScanButton;
