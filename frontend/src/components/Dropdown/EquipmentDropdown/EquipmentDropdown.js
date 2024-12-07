import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import './EquipmentDropdown.css';

function EquipmentDropdown({ title, equipment, addItem, showReserve, showQuantity }) {
    const [isOpen, setIsOpen] = useState(true);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="equipment-dropdown">
            <div className="equipment-dropdown-header" onClick={toggleDropdown}>
                <div>
                    {title}
                </div>
                <div className="equipment-dropdown-arrow">
                    <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown} onClick={toggleDropdown} />
                </div>
            </div>

            {isOpen && (
                <div className="equipment-dropdown-content">
                    {equipment.filter(option => option.quantity > 0).map((option, index) => (
                        <div className="equipment-dropdown-item" key={index}>
                            <div>
                                {index + 1}. {option.displayName ? option.displayName : option.name} | 
                                {typeof option.price === 'number' && !isNaN(option.price) ? `$${option.price}` : "Special Price"} 
                                {showQuantity && ` | Quantity: ${option.quantity}`}
                            </div>

                            {showReserve && (
                                <button 
                                    className="equipment-reserve-button" 
                                    onClick={() => addItem(option)}>
                                    Reserve
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default EquipmentDropdown;
