import React, { useState } from 'react';
import './ReservationHistoryViewDamageReportModal.css';

const ReservationHistoryViewDamageReportModal = ({ show, damageReportInfo, handleClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!show || !damageReportInfo || damageReportInfo.length === 0) {
        return null;
    }
    
    const currentReport = damageReportInfo[currentIndex];

    const handleNext = () => {
        if (currentIndex < damageReportInfo.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            handleClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="view-damage-modal-content">
                <div className="modal-header">
                    <h2>Damage Report Details</h2>
                    <button className="close-button" onClick={handleClose}>
                        &times;
                    </button>
                </div>

                <div className="res-history-modal-body">
                    <div className="report-info">
                        <span className="label">Reporter:</span>
                        <span className="info">{currentReport.reporter}</span>
                    </div>
                    <div className="report-info">
                        <span className="label">Date Reported:</span>
                        <span className="info">
                            {new Date(currentReport.dateCreated).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="report-info">
                        <span className="label">Description:</span>
                        <span className="info">{currentReport.description}</span>
                    </div>
                </div>

                <div className="modal-footer">
                    {damageReportInfo.length === 1 ? (
                        <>
                            <button onClick={handleClose} className="res-history-damage-cancel-button">
                                Cancel
                            </button>
                            <button onClick={handleClose} className="student-view-damage-modal-submit">
                                Done
                            </button>
                        </>
                    ) : currentIndex === 0 ? (
                        <>
                            <button onClick={handleClose} className="res-history-damage-cancel-button">
                                Cancel
                            </button>
                            <button onClick={handleNext} className="student-view-damage-modal-submit">
                                Next
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleBack} className="res-history-damage-cancel-button">
                                Back
                            </button>
                            <button onClick={handleClose} className="student-view-damage-modal-submit">
                                Done
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationHistoryViewDamageReportModal;
