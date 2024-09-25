import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material'; 
import './EquipmentPopup.css'; 

const EquipmentPopup = ({ show, handleClose }) => {
    const [itemID, setItemID] = useState('');
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');

    const predefinedItems = ['Camera', 'Light', 'Tripod', 'Microphone'];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            itemID,
            itemName,
            price,
            quantity
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
                    <div>
                        <div className='form-text'>Item ID</div>
                        <TextField 
                            value={itemID}
                            onChange={(e) => setItemID(e.target.value)} 
                            fullWidth
                            className="mui-textfield" 
                        />
                    </div>

                    <div className="dropdown-wrapper">
                        <div className='form-text'>Item Name</div>
                        <Autocomplete
                            options={predefinedItems}
                            value={itemName}
                            onChange={(event, newValue) => setItemName(newValue || '')} 
                            inputValue={itemName}
                            onInputChange={(event, newInputValue) => setItemName(newInputValue)} 
                            renderInput={(params) => (
                                <TextField 
                                    {...params}
                                    fullWidth
                                    className="mui-textfield" 
                                />
                            )}
                            disableClearable
                        />
                    </div>

                    <div>
                        <div className='form-text'>Price</div>
                        <TextField
                            value={price}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Ensure only numeric values are accepted
                                if (/^\d*\.?\d*$/.test(value)) {
                                    setPrice(value);
                                }
                            }}
                            type="number"
                            fullWidth
                            className="mui-textfield"
                            inputProps={{ min: "0", step: "0.01" }} 
                        />
                    </div>
                    <div>
                        <div className='form-text'>Quantity</div>
                        <TextField
                            value={quantity}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Ensure only numeric values are accepted
                                if (/^\d*\.?\d*$/.test(value)) {
                                    setQuantity(value);
                                }
                            }}
                            type="number"
                            fullWidth
                            className="mui-textfield"
                            inputProps={{ min: "0", step: "1" }} 
                        />
                    </div>

                    
                    <div className="modal-footer">
                        <button type="button" className="cancel-button" onClick={handleClose}>Cancel</button>
                        <button type="submit" className="equipment-popup-submit-button">Add Equipment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EquipmentPopup;
