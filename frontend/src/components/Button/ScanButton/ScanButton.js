import React from 'react';
import './ScanButton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand } from '@fortawesome/free-solid-svg-icons';

const ScanButton = ({ isScanMode, toggleScanMode }) => {
    if (isScanMode) {
        return null; // Do not render the Scan button in scan mode
    }

    return (
        <div onClick={toggleScanMode}>
            <button className="scan-btn">
                Scan
                <FontAwesomeIcon icon={faExpand} className="scan-btn-icon" />
            </button>
        </div>
    );
};

export default ScanButton;
