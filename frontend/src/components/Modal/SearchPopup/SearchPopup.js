import React, { useState, useEffect } from 'react';
import './SearchPopup.css';
import { updateOrderByOrderNumber, isItemIdExist } from '../../../connector'; 

const SearchPopup = ({ goBack, onClose, orderInfo }) => {
    const [itemIds, setItemIds] = useState([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

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
            for (const { itemName, itemId } of updatedEquipment) {
                const response = await isItemIdExist(itemName, itemId);
                if (response.exist) {
                    await updateOrderByOrderNumber(orderInfo.orderNumber, {
                        equipment: updatedEquipment,
                        checkedoutStatus: true,
                        checkedinStatus: false,
                        checkedout: new Date(),
                    });
                    
                    console.log('Order updated successfully');
                    onClose();
                } else {
                    
                }
            }
    
        } catch (error) {
            console.error('Error updating order:', error);
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
                                value={itemIds[index]}
                                onChange={(e) => handleItemIdChange(index, e.target.value)}
                            />
                        </div>
                    </div>
                ))}

                <div className="modal-footer">
                    <button className="scan-cancel-button" onClick={goBack}>Go Back</button>
                    <button
                        className="checkin-button"
                        disabled={isButtonDisabled}
                        onClick={handleEquipmentCheckout}
                    >
                        Student Checked In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SearchPopup;
