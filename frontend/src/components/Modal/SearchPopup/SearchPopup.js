import React, { useState, useEffect } from 'react';
import './SearchPopup.css';
import { updateOrderByOrderNumber } from '../../../connector'; 

const SearchPopup = ({ onClose, orderInfo }) => {
    // Hooks must be at the top level of the component
    const [itemIds, setItemIds] = useState([]); // Initial empty array for itemIds
    const [isButtonDisabled, setIsButtonDisabled] = useState(true); // Initially disable the button

    // Initialize the itemIds state with an array of empty strings when orderInfo changes
    useEffect(() => {
        if (orderInfo && orderInfo.equipment) {
            setItemIds(orderInfo.equipment.map(() => ''));
        }
    }, [orderInfo]);

    // Handle changes in the itemId inputs
    const handleItemIdChange = (index, value) => {
        const newItemIds = [...itemIds];
        newItemIds[index] = value;
        setItemIds(newItemIds);
    };

    // Effect to check if all itemId fields are filled
    useEffect(() => {
        const allFilled = itemIds.every(id => id.trim() !== '');
        setIsButtonDisabled(!allFilled); // Enable the button only if all fields are filled
    }, [itemIds]);

    // Handle the "Student Checked In" button click
    const handleCheckIn = async () => {
        const updatedEquipment = orderInfo.equipment.map((item, index) => ({
            itemName: item, // Assuming equipment contains item names
            itemId: itemIds[index] // Use the corresponding itemId from user input
        }));

        

        try {
            await updateOrderByOrderNumber(orderInfo.orderNumber, updatedEquipment);
            console.log('Order updated successfully');
            onClose(); // Close the popup after updating the order
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    // If no orderInfo is available, return null (after hooks have been initialized)
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

                <h3 className="equipment-header">Equipment Check Out</h3>

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
                                value={itemIds[index]} // Bind to state
                                onChange={(e) => handleItemIdChange(index, e.target.value)} // Update state on input change
                            />
                        </div>
                    </div>
                ))}

                <div className="modal-footer">
                    <button className="scan-cancel-button" onClick={onClose}>Go Back</button>
                    <button
                        className="checkin-button"
                        disabled={isButtonDisabled} // Disable the button if any field is empty
                        onClick={handleCheckIn}
                    >
                        Student Checked In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchPopup;
