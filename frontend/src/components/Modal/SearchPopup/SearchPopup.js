import React, { useState, useEffect } from 'react';
import './SearchPopup.css';
import { updateOrderByOrderNumber, isItemIdExist } from '../../../connector'; 

const SearchPopup = ({ goBack, onClose, orderInfo }) => {
    const [itemIds, setItemIds] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState(''); // New state for error message

    useEffect(() => {
        if (orderInfo && Array.isArray(orderInfo.equipment)) {
            setItemIds(orderInfo.equipment.map(() => ''));
        }
    }, [orderInfo]);
    
    const handleItemIdChange = (index, value) => {
        const newItemIds = [...itemIds];
        newItemIds[index] = value;
        setItemIds(newItemIds);
    };

    useEffect(() => {
        const allFilled = itemIds.every(id => id.trim() !== '');
        setIsButtonDisabled(!allFilled);
    }, [itemIds]);

    const handleEquipmentCheckout = async () => {
        const updatedEquipment = orderInfo.equipment.map((item, index) => ({
            itemName: item.itemName,
            itemId: itemIds[index]
        }));
    
        try {
            setErrorMessage('');
    
            const itemGroups = {};
            for (const { itemName, itemId } of updatedEquipment) {
                if (!itemGroups[itemName]) {
                    itemGroups[itemName] = new Set();
                }
                if (itemGroups[itemName].has(itemId)) {
                    setErrorMessage(`Item IDs for same item "${itemName}" cannot be repetitive.`);
                    return;
                }
                itemGroups[itemName].add(itemId);
            }
    
            for (const { itemName, itemId } of updatedEquipment) {
                const response = await isItemIdExist(itemName, itemId);
    
                if (!response.exists) {
                    setErrorMessage(`The item ID "${itemId}" for "${itemName}" does not exist in our database.`);
                    return;
                }
            }
    
            await updateOrderByOrderNumber(orderInfo.orderNumber, {
                equipment: updatedEquipment,
                checkedoutStatus: true,
                checkedinStatus: false,
                checkedout: new Date()
            });
            onClose();
        } catch (error) {
            console.error('Error updating order:', error);
            setErrorMessage('An error occurred while updating the order.');
        }
    };
    
    

    if (!orderInfo) {
        return null;
    }

    return (
        <div className="search-overlay" onClick={onClose}>
            <div className="search-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className='header-text'>Reservation Information</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="info-order-number">
                    <label htmlFor="orderNumber" className="search-label">Order Number</label>
                    <input
                        type="text"
                        id="orderNumber"
                        className="search-popup-input"
                        defaultValue={orderInfo.orderNumber}
                        readOnly
                    />
                </div>
                <div className="search-section">
                    <div className="search-info-group">
                        <label htmlFor="student-name" className="search-label">Student Name</label>
                        <input
                            type="text"
                            id="student-name"
                            className="search-popup-input"
                            defaultValue={orderInfo.studentName}
                            readOnly
                        />
                    </div>
                    <div className="search-info-group">
                        <label htmlFor="student-email" className="search-label">Student Email</label>
                        <input
                            type="email"
                            id="student-email"
                            className="search-popup-input"
                            defaultValue={orderInfo.email}
                            readOnly
                        />
                    </div>
                </div>

                <h3 className="equipment-header">Equipment Checked-out</h3>

                {orderInfo.equipment.map((item, index) => (
                    <div key={index} className="search-row">
                        <div className="search-item-group">
                            <label className="search-label">Item Name</label>
                            <input
                                type="text"
                                className="search-popup-input"
                                defaultValue={item.itemName}
                                readOnly
                            />
                        </div>
                        <div className="search-item-group">
                            <label className="search-label">Scan the Item ID</label>
                            <input
                                type="text"
                                className="search-popup-input"
                                value={itemIds[index]}
                                onChange={(e) => handleItemIdChange(index, e.target.value)}
                            />
                        </div>
                    </div>
                ))}

                {errorMessage && 
                    <p className="searchpopup-error-message">
                        {errorMessage}<br />
                        <p>
                            Please try again.
                        </p>
                    </p>
                }

                <div className="modal-footer">
                    <button className="scan-cancel-button" onClick={goBack}>Go Back</button>
                    <button
                        className="checkin-button"
                        disabled={isButtonDisabled}
                        onClick={handleEquipmentCheckout}
                    >
                        Student Checked-in Confirmed
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchPopup;
