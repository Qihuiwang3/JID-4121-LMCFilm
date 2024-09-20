import React, { useState } from 'react';
import './EquipmentPopup.css';

const EquipmentPopup = ({ show, handleClose }) => {
    const [itemID, setItemID] = useState('');
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // handle equipment submission logic
        console.log({
            itemID,
            itemName,
            price,
            category
        });
        handleClose(); // Close modal after submitting
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Add a New Equipment</h2>
                    <button className="close-button" onClick={handleClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Item ID</label>
                        <input 
                            type="text" 
                            value={itemID} 
                            onChange={(e) => setItemID(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Item Name</label>
                        <input 
                            type="text" 
                            value={itemName} 
                            onChange={(e) => setItemName(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Price</label>
                        <input 
                            type="text" 
                            value={price} 
                            onChange={(e) => setPrice(e.target.value)} 
                        />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Select Category</option>
                            <option value="electronics">Electronics</option>
                            <option value="furniture">Furniture</option>
                            <option value="tools">Tools</option>
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="cancel-button" onClick={handleClose}>Cancel</button>
                        <button type="submit" className="submit-button">Add Equipment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EquipmentPopup;
