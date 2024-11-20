import React, { useEffect, useState } from 'react'; 
import './UserClassCodeModal.css';
import { getStudentClassCodeByEmail } from '../../../connector';

const UserClassCodeModal = ({ show, onClose, userEmail }) => {
    const [classCodes, setClassCodes] = useState([]);

    useEffect(() => {
      const fetchClassCodes = async () => {
          try {
              const codes = await getStudentClassCodeByEmail(userEmail);
              setClassCodes(codes);
          } catch (error) {
              console.error('Error fetching class codes:', error);
          }
      };
      if (userEmail) fetchClassCodes();
  }, [userEmail]);

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="class-code-modal-content">
                <div className="modal-header">
                    <h2>View Classes</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    {classCodes.map((code, index) => (
                          <div key={index} className="class-code-row">
                            <div className="class-code-report-info">
                                <span className="label">Class Code {index + 1}</span>
                                <input type="text" value={code} readOnly />
                            </div>
                            {/* <div className="class-code-report-info">
                              <span className="label">Code</span>
                              <input type="text" value={''} readOnly />
                            </div>
                            <div className="class-code-report-info">
                              <span className="label">Professor</span>
                              <input type="text" value={''} readOnly />
                            </div> */}
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
