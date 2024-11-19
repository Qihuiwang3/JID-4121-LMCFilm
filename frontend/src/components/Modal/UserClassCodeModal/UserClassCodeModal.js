import React from 'react';
import './UserClassCodeModal.css';

const UserClassCodeModal = ({ show, onClose, studentData }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="class-code-modal-content">
        <div className="modal-header">
          <h2>View Class</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
            <div className="class-code-report-info">
                <span className="label">Class Name</span>
                <input type="text" value={studentData.name} readOnly />
            </div>
            <div className="class-code-report-info">
                <span className="label">Code</span>
                <input type="text" value={studentData.email} readOnly />
            </div>
            <div className="class-code-report-info">
                <span className="label">Professor</span>
                <input type="text" value={studentData.role} readOnly />
            </div>
        </div>
        <div className="modal-footer">
          <button className='class-code-done' onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};

export default UserClassCodeModal;