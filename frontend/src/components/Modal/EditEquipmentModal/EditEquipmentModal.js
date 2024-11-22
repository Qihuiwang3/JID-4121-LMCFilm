import React, { useState, useEffect } from 'react';
import './EditEquipmentModal.css';
import { updateItem, getItems } from '../../../connector';

const EditEquipmentModal = ({ show, handleClose, equipmentToEdit, onEquipmentUpdated }) => {
    const [itemName, setItemName] = useState(equipmentToEdit?.itemName || '');
    const [pricePerItem, setPricePerItem] = useState(equipmentToEdit?.pricePerItem || '');
    const [itemId, setItemId] = useState(equipmentToEdit?.itemId || '');
    const [error, setError] = useState('');

    useEffect(() => {
        if (equipmentToEdit) {
            setItemName(equipmentToEdit.itemName);
            setPricePerItem(equipmentToEdit.pricePerItem);
            setItemId(equipmentToEdit.itemId);
        }
    }, [equipmentToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!pricePerItem || !itemId) {
            setError('Please fill out all required fields.');
            return;
        }

        const updateData = {
            itemName: equipmentToEdit.itemName,
            itemId: equipmentToEdit.itemId,
            newPrice: parseFloat(pricePerItem),
            newItemId: itemId,  
        };

        try {
            const response = await updateItem(updateData);
            onEquipmentUpdated(); 
            handleClose();
        } catch (error) {
            console.error('Error updating equipment:', error);
            setError('Failed to update the equipment.');
        }
    };
    

    if (!show) {
        return null;
    }

    return (
        <div className="edit-item-modal-overlay">
            <div className="edit-item-modal-content">
                <div className="modal-header">
                    <h2>Edit Equipment</h2>
                    <button className="close-button" onClick={handleClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="edit-item-modal-form">
                    <div className="edit-item-modal-info">
                        <label className="edit-item-modal-label">Item Name</label>
                        <input
                            type="text"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            readOnly
                        />
                    </div>
                    <div className="edit-item-modal-info">
                        <label className="edit-item-modal-label">Price per Item</label>
                        <input
                            type="number"
                            step="0.01"
                            value={pricePerItem}
                            onChange={(e) => setPricePerItem(e.target.value)}
                            required
                        />
                    </div>
                    <div className="edit-item-modal-info">
                        <label className="edit-item-modal-label">Item ID</label>
                        <input
                            type="text"
                            value={itemId}
                            onChange={(e) => setItemId(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="edit-item-modal-error-message">{error}</div>}
                    <div className="edit-item-modal-footer">
                        <button type="submit" className="edit-item-submit-button">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEquipmentModal;
