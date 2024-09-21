import React, { useState } from 'react';
import './EquipmentPopup.css';

const EquipmentPopup = ({ show, handleClose }) => {
    const [itemID, setItemID] = useState('');
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            itemID,
            itemName,
            price,
            category
        });
        handleClose(); 
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="header-text">Add a New Equipment</h2>
                    <button 
                        className="close-button" 
                        onClick={handleClose}
                    >
                        <div className='close-button-inner'>
                            &times;
                        </div>
                    </button>
                </div>
                <hr className="header-divider" />
                
                <form onSubmit={handleSubmit} className="modal-form">
                    <div >
                        <div className='form-text'>Item ID</div>
                        <input 
                            type="text" 
                            value={itemID} 
                            onChange={(e) => setItemID(e.target.value)} 
                        />
                    </div>
                    <div >
                        <div className='form-text'>Item Name</div>
                        <input 
                            type="text" 
                            value={itemName} 
                            onChange={(e) => setItemName(e.target.value)} 
                        />
                    </div>
                    <div >
                        <div className='form-text'>Price</div>
                        <input 
                            type="text" 
                            value={price} 
                            onChange={(e) => setPrice(e.target.value)} 
                        />
                    </div>
                    <div>
                        <div className='form-text'>Category</div>
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Select Category</option>
                            <option value="camera">Camera</option>
                            <option value="light">Light</option>
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
