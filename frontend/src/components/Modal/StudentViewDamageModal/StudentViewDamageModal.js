import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import './StudentViewDamageModal.css';
import { getAllDamageReports, getSingleDamageReport } from '../../../connector';
import Camera from '../../../Image/Camera.svg'

const StudentViewDamageModal = ({ orderItems, handleClose }) => {

    const [report, setReport] = useState(0);
    const [damageReports, setDamageReports] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const reportData = await getAllDamageReports();
                const matchingReportIds = reportData
                    .filter(report =>
                        orderItems.some(orderItem =>
                            orderItem.itemId === report.itemId && orderItem.itemName === report.itemName
                        )
                    )
                    .map(report => report._id);

                const fetchedReports = await Promise.all(
                    matchingReportIds.map(async (id) => await getSingleDamageReport(id))
                );

                setDamageReports(fetchedReports);
                setReport(fetchedReports[0]);

            } catch (error) {
                console.error("An error occurred:", error);
            }
        };
        fetchReport();
    }, [orderItems]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % damageReports.length;
            setReport(damageReports[newIndex]);
            return newIndex;
        });
    };

    const handleBack = () => {
        setCurrentIndex((prevIndex) => {
            const newIndex = (prevIndex - 1 + damageReports.length) % damageReports.length;
            setReport(damageReports[newIndex]);
            return newIndex;
        });
    };

    const imageStyle = {
        width: '250px',
        height: 'auto',
        display: 'inline-block',
        marginLeft: '70px'
    };

    return (
        <div className="modal-overlay">
            <div className="modal-contentC">
                <div className="modal-header">
                    <h2>View Damage Report</h2>
                    <button className="close-button" onClick={handleClose}>×</button>
                </div>
                <div className="report-details">
                    <p><strong>Reporter:</strong> {report?.reporter || 'Loading...'}</p>
                    <p>
                        <strong>Date Reported:</strong> {
                            report?.dateCreated
                                ? new Date(report.dateCreated).toLocaleDateString('en-US', {
                                    month: '2-digit',
                                    day: '2-digit',
                                    year: '2-digit'
                                })
                                : 'Loading...'
                        }
                    </p>
                    <p><strong>Description:</strong> {report?.description || 'Loading...'}</p>
                    <div>
                        {report?.images && report.images.length > 0 ? (
                            <div
                                className={report.images.length > 1 ? "image-scroll-container" : ""}
                                style={{ overflowX: report.images.length > 1 ? "scroll" : "hidden" }}
                            >
                                {report.images.map((image, index) => (
                                    <img key={index} src={image} alt={`Damage image ${index + 1}`} style={imageStyle} />
                                ))}
                            </div>
                        ) : (
                            <img src={Camera} alt="Camera Icon" style={imageStyle} />
                        )}
                    </div>
                </div>
                <div className="student-view-damage-modal-footer">
                    <div className="student-view-damage-modal-navigate">
                        {damageReports.length > 1 && (
                            <>
                                <button onClick={handleBack} className="student-view-damage-modal-back"> Back </button>
                                <button onClick={handleNext} className="student-view-damage-modal-next"> Next </button>
                            </>
                        )}
                    </div>
                    <button className="saveModal-button" onClick={handleClose}>Done</button>
                </div>
            </div>
        </div>
    );
}

export default StudentViewDamageModal;