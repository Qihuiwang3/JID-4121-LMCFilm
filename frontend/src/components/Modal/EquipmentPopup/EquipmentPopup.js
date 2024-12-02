import React, { useState, useEffect } from 'react';
import './EquipmentPopup.css';
import { getItems } from '../../../connector.js';


const EquipmentPopup = ({ show, handleClose, onEquipmentUpdated }) => {
    const [itemID, setItemID] = useState('');
    const [itemName, setItemName] = useState('');
    const [price, setPrice] = useState(0);
    const [error, setError] = useState('');

    const [uniqueItemNames, setUniqueItemNames] = useState([]); 
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

            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems(); // Call the async function
    }, []); // Empty array to run only on mount

    const resetFields = () => {
        setItemID('');
        setItemName('');
        setPrice('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!itemName || !itemID || !price) {
            setError("All fields are required.");
            return;
        }

        try {
            await onEquipmentUpdated();
            resetFields();
            handleClose();
        } catch (error) {
            setError("Failed to add equipment. Please check duplicate ID");
            console.error('Error creating global item:', error);
        }
    };

    const handleItemNameChange = (value) => {
        setItemName(value);
        const selectedItem = databasePrices.find(item => item.itemName === value);
        if (selectedItem) {
            setPrice(selectedItem.pricePerItem); // Auto-fill price
        } else {
            setPrice(''); // Reset price if the item name is new
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div className="edit-item-modal-overlay">
            <div className="edit-item-modal-content">
                <div className="modal-header">
                    <h2>Add New Equipment</h2>
                    <button className="close-button" onClick={handleClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="edit-item-modal-form">
                    <div className="edit-item-modal-info">
                        <label className="edit-item-modal-label">Item Name</label>
                        <select
                            value={itemName}
                            onChange={(e) => handleItemNameChange(e.target.value)}
                            className="edit-item-modal-select"
                        >
                            <option value=""></option>
                            {uniqueItemNames.map(name => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="edit-item-modal-info">
                        <label className="edit-item-modal-label">Item ID</label>
                        <input
                            type="text"
                            value={itemID}
                            onChange={(e) => setItemID(e.target.value)}
                            required
                        />
                    </div>
                    <div className="edit-item-modal-info">
                        <label className="edit-item-modal-label">Price per Item</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            step="0.01"
                            min="0"
                        />
                    </div>
                    {error && <div className="edit-item-modal-error-message">{error}</div>}
                    <div className="edit-item-modal-footer">
                        <button type="button" className="edit-item-cancel-button" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit" className="edit-item-submit-button">
                            Add Equipment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EquipmentPopup;
