import React, { useState, useEffect } from 'react';
import './DamageReportModal.css';
import { createDamageReport, getItems, getStudents } from '../../../connector'; 
import { useSelector } from 'react-redux';
const DamageReportModal = ({ show, handleClose, onReportAdded, reportToEdit }) => {
    const reporter = useSelector((state) => state.studentData.name);
    const [dateReported] = useState(new Date().toISOString().split('T')[0]); 
    const [studentEmail, setStudentEmail] = useState(reportToEdit?.studentEmail || '');
    const [itemId, setItemId] = useState(reportToEdit?.itemId || '');
    const [itemName, setItemName] = useState(reportToEdit?.itemName || '');
    const [description, setDescription] = useState(reportToEdit?.description || '');
    const [uploadedImage, setUploadedImage] = useState(reportToEdit?.images || null);
    const [imagePreview, setImagePreview] = useState(reportToEdit?.images || null);
    const [error, setError] = useState('');
    const [items, setItems] = useState([]);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const fetchedItems = await getItems(); 
                const fetchedStudents = await getStudents();
                setStudents(fetchedStudents);
                setItems(fetchedItems);
            } catch (error) {
                console.error('Error fetching items:', error);
            }
        };
        fetchItems();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.match('image/jpeg|image/png|image/jpg|image/jpeg')) {
                setError('Only JPG or PNG files are allowed');
                return;
            }
            const reader = new FileReader();
            reader.onload = function (event) {
                setUploadedImage(event.target.result); 
            };
            reader.readAsDataURL(file);
            setImagePreview(URL.createObjectURL(file));
            setError('');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentEmail || !itemId || !itemName || !description) {
            setError('Please fill out all required fields.');
            return;
        }

        const studentExists = students.some(student => student.email === studentEmail);
        if (!studentExists) {
            setError('Student email not found.');
            return;
        }

        const item = items.find(item => item.itemName === itemName);
        if (!item) {
            setError('Item name not found.');
            return;
        }

        const itemIdExists = item.itemIds.some(idObj => idObj.itemId === itemId);
        if (!itemIdExists) {
            setError('Item ID not found.');
            return;
        }

        const data = {
            reporter: reporter,
            dateCreated: dateReported,
            studentEmail: studentEmail,
            itemId: itemId,
            itemName: itemName,
            description: description,
            images: uploadedImage ? [uploadedImage] : [], 
        };

        try {
            const newReport = await createDamageReport(data);
            onReportAdded(newReport);
            handleClose(); 
        } catch (error) {
            console.error('Error submitting damage report:', error);
            setError('Failed to submit the damage report.');
        }
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
                    <div className='damage-report'>
                        <div className='damage-reportor'>
                            <div className='damage-lable'>Reporter</div>
                            <input type="text" value={reporter} readOnly />
                        </div>
                        <div className='damage-date'> 
                            <div className='damage-lable'>Date Reported</div>
                            <input type="date" value={dateReported} readOnly />
                        </div>
                    </div>
                    
                    <div className='damage-info'>
                        <div className='damage-lable'>Student Email</div>
                        <input
                            type="email"
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='damage-info'>
                        <div className='damage-lable'>Item ID</div>
                        <input
                            type="text"
                            value={itemId}
                            onChange={(e) => setItemId(e.target.value)}
                            required
                        />
                    </div>
                    <div className='damage-info'>
                        <div className='damage-lable'>Item Name</div>
                        <select
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            required
                        >
                            <option value="">Select Item</option>
                            {items.map(item => (
                                <option key={item.itemName} value={item.itemName}>
                                    {item.itemName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='damage-info'>
                        <div className='damage-lable'>Description</div>
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div className='damage-info'>
                        <div className='damage-lable'>Upload Image (optional)</div>
                        <input type="file" accept="image/jpeg, image/png, image/jpg" onChange={handleImageUpload} />
                        {imagePreview && (
                            <div className="uploaded-image-preview">
                                <img src={imagePreview} alt="Uploaded Preview" className="image-preview-size"/>
                            </div>
                        )}
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="modal-footer">
                        <button type="submit" className="damage-submit-button">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DamageReportModal;
