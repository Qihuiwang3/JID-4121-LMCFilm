import React, { useState } from 'react';
import './DamageReportModal.css';

const DamageReportModal = ({ show, handleClose }) => {
    const [reporter, setReporter] = useState('Admin A');
    const [dateReported] = useState(new Date().toISOString().split('T')[0]); 
    const [studentEmail, setStudentEmail] = useState('');
    const [itemId, setItemId] = useState('');
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [error, setError] = useState('');

    const handleImageUpload = (e) => {
        setUploadedImage(e.target.files[0]);
    };

    const handleImageRemove = () => {
        setUploadedImage(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!studentEmail || !itemId || !itemName || !description) {
            setError('Please fill all required fields.');
            return;
        }
        

        // Close modal
        handleClose();
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Submit Damage Report</h2>
                    <button className="close-button" onClick={handleClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div>
                        <label>Reporter</label>
                        <input type="text" value={reporter} readOnly />
                    </div>
                    <div>
                        <label>Date Reported</label>
                        <input type="date" value={dateReported} readOnly />
                    </div>
                    <div>
                        <label>Student Email</label>
                        <input
                            type="email"
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Scan the bar code</label>
                        <input
                            type="text"
                            value={itemId}
                            onChange={(e) => setItemId(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Item Name</label>
                        <input
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label>Upload Image (optional)</label>
                        <input type="file" onChange={handleImageUpload} />
                        {uploadedImage && (
                            <div className="uploaded-image-preview">
                                <img src={URL.createObjectURL(uploadedImage)} alt="uploaded" />
                                <button type="button" onClick={handleImageRemove}>Remove</button>
                            </div>
                        )}
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="modal-footer">
                        <button type="button" className="cancel-button" onClick={handleClose}>Cancel</button>
                        <button type="submit" className="submit-button">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DamageReportModal;
