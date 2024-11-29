import React from 'react';
import './ReservationHistoryViewDamageReportModal.css';

const ReservationHistoryViewDamageReportModal = ({ show, damageReportInfo, handleClose }) => {
    if (!show || !damageReportInfo) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="view-damage-modal-content">
                <div className="modal-header">
                    <h2>Damage Report Details</h2>
                    <button className="close-button" onClick={handleClose}>
                        &times;
                    </button>
                </div>

                <div className="modal-body">
                    <div className="report-info">
                        <span className="label">Reporter:</span>
                        <span className="info">{damageReportInfo.reporter}</span>
                    </div>
                    <div className="report-info">
                        <span className="label">Date Reported:</span>
                        <span className="info">
                            {new Date(damageReportInfo.dateCreated).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="report-info">
                        <span className="label">Description:</span>
                        <span className="info">{damageReportInfo.description}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReservationHistoryViewDamageReportModal;
