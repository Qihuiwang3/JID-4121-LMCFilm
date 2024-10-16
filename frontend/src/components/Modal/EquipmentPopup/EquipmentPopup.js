import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import './EquipmentPopup.css';
import { getItems, createGlobalItem } from '../../../connector.js';


const EquipmentPopup = ({ show, handleClose }) => {
    const [itemID, setItemID] = useState('');
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState(0);

    const [uniqueItemNames, setUniqueItemNames] = useState([]); // State for unique item names
    const [databasePrices, setDatabasePrices] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const items = await getItems();

                const prices = items.flatMap(record =>
                    record.itemIds.map(itemId => ({
                        itemName: record.itemName,
                        pricePerItem: record.pricePerItem,
                    }))
                );

                setDatabasePrices(prices);
                const uniqueNames = [...new Set(prices.map(item => item.itemName))];
                setUniqueItemNames(uniqueNames);
                console.log(prices);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems(); // Call the async function
    }, []); // Empty array to run only on mount

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            itemName,
            pricePerItem: price,
            itemIds: [itemID]
        };

        try {
            const response = await createGlobalItem(data);
            console.log('Global item created:', response);

            handleClose();
        } catch (error) {
            console.error('Error creating global item:', error);
        }
    };

    const handleItemNameChange = (newValue) => {
        setItemName(newValue || '');

        // Find the price associated with the selected item name
        const selectedItem = databasePrices.find(item => item.itemName === newValue);
        if (selectedItem) {
            setPrice(selectedItem.pricePerItem);
        } else {
            setPrice(0); // Reset price if item not found
        }
    };

    if (!show) {
        return null;
    }

    const isSubmitDisabled = !itemID || !itemName;



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
                {/* <hr className="header-divider" /> */}

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
                            options={uniqueItemNames}
                            value={itemName}
                            onChange={(event, newValue) => { setItemName(newValue || ''); handleItemNameChange(newValue); }}
                            inputValue={itemName}
                            onInputChange={(event, newInputValue) => { setItemName(newInputValue); handleItemNameChange(newInputValue); }}
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

                    <div className="modal-footer">
                        <button type="button" className="equipment-cancel-button" onClick={handleClose}>Cancel</button>
                        <button
                            type="submit"
                            className="equipment-popup-submit-button"
                            disabled={isSubmitDisabled}
                        > Add Equipment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EquipmentPopup;
