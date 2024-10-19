import React, { useEffect, useState } from 'react';
import './ViewDamageModal.css'; 
import { getSingleDamageReport } from '../../../connector'; 

const ViewDamageModal = ({ show, reportId, handleClose, handleEdit }) => {
    const [report, setReport] = useState(null);

    useEffect(() => {
        if (reportId) {
            const fetchReport = async () => {
                try {
                    const reportData = await getSingleDamageReport(reportId);
                    setReport(reportData);
                } catch (error) {
                    console.error('Error fetching damage report:', error);
                }
            };
            fetchReport();
        }
    }, [reportId]);

    if (!show || !report) {
        return null;
    }

    const handleEditClick = () => {
        handleEdit(report);
        handleClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>View Damage Report</h2>
                    <button className="close-button" onClick={handleClose}>
                        &times;
                    </button>
                </div>

                <div className="modal-body">
                    <div className="report-info">
                        <span className="label">Reporter:</span>
                        <span className="info">{report.reporter}</span>
                    </div>
                    <div className="report-info">
                        <span className="label">Student Info:</span>
                        <span className="info">{report.studentEmail}</span>
                    </div>
                    <div className="report-info">
                        <span className="label">Item Reported:</span>
                        <span className="info">{report.itemName}</span>
                    </div>
                    <div className="report-info">
                        <span className="label">Item ID:</span>
                        <span className="info">{report.itemId}</span>
                    </div>
                    <div className="report-info">
                        <span className="label">Date Reported:</span>
                        <span className="info">{new Date(report.dateCreated).toLocaleDateString()}</span>
                    </div>
                    <div className="report-info">
                        <span className="label">Description:</span>
                        <span className="info">{report.description}</span>
                    </div>

                    {report.images && report.images.length > 0 && (
                        <div className="report-info">
                            <img src={report.images[0]} alt="Damage" style={{ width: '100%' }} />
                        </div>
                    )}

                    <div className="modal-footer">
                        <button type="submit" className="damage-submit-button" onClick={handleEditClick}>Edit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewDamageModal;
