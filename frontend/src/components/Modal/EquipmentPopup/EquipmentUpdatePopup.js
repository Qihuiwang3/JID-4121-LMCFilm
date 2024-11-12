import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import './EquipmentAddPopup.css';
import { getItems, updateGlobalItem } from '../../../connector.js';

const EquipmentUpdatePopup = ({ show, handleClose, existingData, onUpdateComplete }) => {
    const [itemID, setItemID] = useState('');
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState(0);

    const [uniqueItemNames, setUniqueItemNames] = useState([]);
    const [databasePrices, setDatabasePrices] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const items = await getItems();

                const prices = items.flatMap(record =>
                    record.itemIds.map(itemId => ({
                        itemId: record.itemId,
                        itemName: record.itemName,
                        pricePerItem: record.pricePerItem,
                    }))
                );

                setDatabasePrices(prices);
                const uniqueNames = [...new Set(prices.map(item => item.itemName))];
                setUniqueItemNames(uniqueNames);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();

        // Pre-fill fields with existing data if provided
        if (existingData) {
            setItemID(existingData.itemId);
            setItemName(existingData.itemName);
            setPrice(existingData.pricePerItem);
        }
    }, [existingData]); // Re-run if `existingData` changes

    const handleUpdate = async (e) => {
        e.preventDefault();

        const data = {
            itemName,
            pricePerItem: price,
            itemIds: [itemID]
        };

        try {
            await updateGlobalItem(existingData._id, data);

            console.log('Global item updated:', data);

            if (onUpdateComplete) {
                onUpdateComplete();
            }

            // Close the modal
            handleClose();
        } catch (error) {
            console.error('Error updating global item:', error);
        }
    };

    const handleItemNameChange = (newValue) => {
        setItemName(newValue || '');

        const selectedItem = databasePrices.find(item => item.itemName === newValue);
        if (selectedItem) {
            setPrice(selectedItem.pricePerItem);
        } else {
            setPrice(0);
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
                    <h2 className="header-text">Update Equipment</h2>
                    <button className="close-button" onClick={handleClose}>
                        <div className='close-button-inner'>&times;</div>
                    </button>
                </div>

                <form onSubmit={handleUpdate} className="modal-form">
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
                        > Update Equipment</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EquipmentUpdatePopup;

