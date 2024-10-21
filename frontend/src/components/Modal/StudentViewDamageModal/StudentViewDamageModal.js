import React, { useState, useEffect } from 'react';
    import { Autocomplete, TextField } from '@mui/material';
    import './StudentViewDamageModal.css';
    import { getSingleDamageReport } from '../../../connector';
    import Camera from '../../../Image/Camera.svg'




    const StudentViewDamageModal = ({ show, reportId, handleClose }) => {


        const [report, setReport] = useState(null);


    useEffect(() => {
        if (show) {
            const fetchReport = async () => {
                try {     //should be reprotId but backend doenst have any connection between order and damageReport
                    const reportData = await getSingleDamageReport("670ffc32f3839f2390d162f6");
                    setReport(reportData);
                } catch (error) {
                    console.error('Error fetching damage report:', error);
                }
            };
            fetchReport();
        }
    }, );


    if (!show || !report) {
        return null;
    }


        const imageStyle = {
            width: '250px',
            height: 'auto',
            display: 'inline-block',
            marginLeft: '70px'


        };


        if (!show) {
            return null;
        }


return (


    <div className="modal-overlay">
        <div className="modal-contentC">
            <div className="modal-header">
                <h2>View Damage Report</h2>
                <button className="close-button" onClick={handleClose}>×</button>
            </div>
            <div className="report-details">
                            <p><strong>Reporter:</strong> {report.reporter || 'Admin (All Test before blank)'}</p>
                            <p><strong>Date Reported:</strong> {report.date || '10/25/25'}</p>
                            <p><strong>Description:</strong> {report.description || 'The lens of the camera is broken. Everything is always broken'}</p>
                            <p>
                            <p>
  {report.images && report.images.length > 0 ? (
    <div
      className={report.images.length > 1 ? "image-scroll-container" : ""}
      style={{ overflowX: report.images.length > 1 ? "scroll" : "hidden" }}
    >
      {report.images.map((image, index) => (
        <img key={index} src={image} alt={`Damage image ${index + 1}`} style={imageStyle} />
      ))}
    </div>
  ) : (
    // Default camera icon when no images are available
    <img src={Camera} alt="Camera Icon" style={imageStyle} />
  )}
</p>


                       </p>
            </div>
            <div className="modal-footer">
                <button className="cancelModal-button" onClick={handleClose}>Cancel</button>
                <button className="saveModal-button" onClick={handleClose}>Done</button>
            </div>
        </div>
    </div>




);


}


export default StudentViewDamageModal;

