import React from "react";
import "./StatusModal.css";


const formatDate = (dateTime) => {
    if (!dateTime) return "N/A";
    console.log(dateTime);
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
};

const StatusModal = ({ show, onClose, item }) => {
    if (!show) return null;

    return (
        <div className="status-modal-overlay">
          <div className="status-modal-content">
            <div className="modal-header">
              <h2>Equipment Status</h2>
              <button className="close-button" onClick={onClose}>×</button>
            </div>
            <div className="status-modal-body">
                <div>
                    <label>Expected Return Date</label>
                    <input type="text" value={formatDate(item.checkin)} readOnly />
                </div>
                <div>
                    <label>Checked Out By</label>
                    <input type="text" value={formatDate(item.checkout)} readOnly />
                </div>
            </div>
            <div className="modal-footer">
              <button className='profile-done' onClick={onClose}>Done</button>
            </div>
          </div>
        </div>
      );
};

export default StatusModal;
