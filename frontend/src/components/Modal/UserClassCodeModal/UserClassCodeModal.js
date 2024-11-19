import React, { useEffect, useState } from 'react'; 
import './UserClassCodeModal.css';
import { getStudentClassCodeByEmail } from '../../../connector';

const UserClassCodeModal = ({ show, onClose, userEmail }) => {
    const [classCode, setClassCode] = useState({});

    useEffect(() => {
        const fetchClassCode = async () => {
            try {
                const info = await getStudentClassCodeByEmail(userEmail);
                setClassCode(info);
            } catch (error) {
                console.error('Error fetching class codes:', error);
            }
        };
        if (userEmail) fetchClassCode();
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
                    <div className="class-code-row">
                        <div className="class-code-report-info">
                            <span className="label">Class Name</span>
                            <input type="text" value={classCode.name || ''} readOnly />
                        </div>
                        <div className="class-code-report-info">
                            <span className="label">Code</span>
                            <input type="text" value={classCode.email || ''} readOnly />
                        </div>
                        <div className="class-code-report-info">
                            <span className="label">Professor</span>
                            <input type="text" value={classCode.role || ''} readOnly />
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="class-code-done" onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
    );
};

export default UserClassCodeModal;
