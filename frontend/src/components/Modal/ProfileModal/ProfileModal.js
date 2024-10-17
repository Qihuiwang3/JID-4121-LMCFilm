import React from 'react';
import './ProfileModal.css';

const ProfileModal = ({ show, onClose, studentData }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="profile-modal-content">
        <div className="modal-header">
          <h2>My Profile</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
            <div className="profile-report-info">
                <span className="label">Name:</span>
                <input type="text" value={studentData.name} readOnly />
            </div>
            <div className="profile-report-info">
                <span className="label">Email:</span>
                <input type="text" value={studentData.email} readOnly />
            </div>
            <div className="profile-report-info">
                <span className="label">Role:</span>
                <input type="text" value={studentData.role} readOnly />
            </div>
        </div>
        <div className="modal-footer">
          <button className='profile-done' onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;