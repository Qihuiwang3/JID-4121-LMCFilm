import React, { useState } from 'react'; 
import './UserClassCodeModal.css';

const UserClassCodeModal = ({ show, onClose, userInfo }) => {
    if (!show) return null;
    return (
        <div className="modal-overlay">
            <div className="class-code-modal-content">
                <div className="modal-header">
                    <h2>View Classes</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    {userInfo.map((info, index) => (
                          <div key={index} className="class-code-row">
                            <div className="class-code-report-info">
                                <span className="label">Class Name</span>
                                <input type="text" value={info.className} readOnly />
                            </div>
                            <div className="class-code-report-info">
                              <span className="label">Code</span>
                              <input type="text"  value={info.classCode}  readOnly />
                            </div>
                            <div className="class-code-report-info">
                              <span className="label">Professor</span>
                              <input type="text"  value={info.professor}  readOnly />
                            </div>
                          </div>
                      ))}
                </div>
                
                <div className="modal-footer">
                    <button className="class-code-done" onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
    );
};

export default UserClassCodeModal;
