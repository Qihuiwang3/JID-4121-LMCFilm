import React, { useState, useEffect } from 'react';
import './DamageReportModal.css';
import { createDamageReport, getItems, getStudents, updateDamageReport, getOrderByOrderNumber } from '../../../connector';
import { useSelector } from 'react-redux';
const DamageReportModal = ({ show, handleClose, onReportAdded, reportToEdit }) => {
    const reporter = useSelector((state) => state.studentData.name);
    const [dateReported] = useState(new Date().toISOString().split('T')[0]);
    const [studentEmail, setStudentEmail] = useState(reportToEdit?.studentEmail || '');
    const [orderNumber, setOrderNumber] = useState(reportToEdit?.orderNumber || '');
    const [itemId, setItemId] = useState(reportToEdit?.itemId || '');
    const [itemName, setItemName] = useState(reportToEdit?.itemName || '');
    const [description, setDescription] = useState(reportToEdit?.description || '');
    const [uploadedImage, setUploadedImage] = useState(reportToEdit?.images || null);
    const [imagePreview, setImagePreview] = useState(reportToEdit?.images || null);
    const [error, setError] = useState('');
    const [items, setItems] = useState([]);
    const [students, setStudents] = useState([]);
    const [isOrderValid, setIsOrderValid] = useState(true);

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

    const validateOrderNumber = async () => {
        try {
            const order = await getOrderByOrderNumber(orderNumber);
            setIsOrderValid(true);
            setStudentEmail(order.email);
        } catch (error) {
            setIsOrderValid(false);
            setError('Order number does not exist in the system.');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!studentEmail || !itemId || !itemName || !description) {
            setError('Please fill out all required fields.');
            return;
        }

        if (!isOrderValid) {
            setError('Invalid order number. Please correct it.');
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
            orderNumber: orderNumber,
            studentEmail: studentEmail,
            itemId: itemId,
            itemName: itemName,
            description: description,
            images: uploadedImage ? [uploadedImage] : [],
        };

        try {
            if (reportToEdit) {
                await updateDamageReport(reportToEdit._id, data);
            } else {
                const newReport = await createDamageReport(data);
                onReportAdded(newReport);
            }
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
            <div className="view-damage-modal-content">
                <div className="modal-header">
                    <h2>Submit Damage Report</h2>
                    <button className="close-button" onClick={handleClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className='damage-modal-report'>
                        <div className='damage-modal-reportor'>
                            <div className='damage-modal-label'>Reporter</div>
                            <input type="text" value={reporter} readOnly />
                        </div>
                        <div className='damage-modal-date'>
                            <div className='damage-modal-label'>Date Reported</div>
                            <input type="date" value={dateReported} readOnly />
                        </div>
                    </div>

                    <div className='damage-modal-info'>
                        <div className='damage-modal-label'>Order Number</div>
                        <input
                            type="text"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            onBlur={validateOrderNumber}
                            required
                        />
                    </div>

                    <div className='damage-modal-info'>
                        <div className='damage-modal-label'>Student Email</div>
                        <input
                            type="email"
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='damage-modal-info'>
                        <div className='damage-modal-label'>Item ID</div>
                        <input
                            type="text"
                            value={itemId}
                            onChange={(e) => setItemId(e.target.value)}
                            required
                        />
                    </div>
                    <div className='damage-modal-info'>
                        <div className='damage-modal-label'>Item Name</div>
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

                    <div className='damage-modal-info'>
                        <div className='damage-modal-label'>Description</div>
                        <input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div className='damage-modal-info'>
                        <div className='damage-modal-label'>Upload Image (optional)</div>
                        <input type="file" accept="image/jpeg, image/png, image/jpg" onChange={handleImageUpload} />
                        {imagePreview && (
                            <div className="damage-modal-uploaded-image-preview">
                                <img src={imagePreview} alt="Uploaded Preview" className="damage-modal-image-preview-size" />
                            </div>
                        )}
                    </div>
                    {error && <div className="damage-modal-error-message">{error}</div>}
                    <div className="damage-modal-footer">
                        <button type="submit" className="damage-submit-button">Save</button>
                    </div>
                </form >
            </div >
        </div >
    );
};

export default DamageReportModal;
