import React, { useState } from 'react';
import { Autocomplete, TextField } from '@mui/material'; 
import './EquipmentPopup.css';

const EquipmentPopup = ({ show, handleClose }) => {
    const [itemID, setItemID] = useState('');
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState('');

    const predefinedItems = ['Camera', 'Light', 'Tripod', 'Microphone'];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
            itemID,
            itemName,
            price
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
                            variant="outlined"
                            value={itemID}
                            onChange={(e) => setItemID(e.target.value)} 
                            fullWidth
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
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                            freeSolo
                        />
                    </div>

                    <div>
                        <div className='form-text'>Price</div>
                        <TextField
                            variant="outlined"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            fullWidth
                        />
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
