import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import PackageEquipmentDropdown from '../PackageEquipmentDropdown/PackageEquipmentDropdown.js';
import './PackageDropdown.css';

function PackageDropdown({ id, title, pk, addItem, showReserve, showQuantity }) {
    const [isOpen, setIsOpen] = useState(true);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="package-dropdown">
            <div className="equipment-dropdown-header" onClick={toggleDropdown}>
                <div>
                    {title}
                </div>
                <div className='equipment-dropdown-arrow'>
                    <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown} onClick={toggleDropdown} />
                </div>
            </div>

            {isOpen && (
                <div className="package-dropdown-content">
                    {pk.map((option, index) => (
                        <div className="package-dropdown-item" key={index}>
                            <PackageEquipmentDropdown
                                id="i"
                                title={(index + 1) + ". " + option.name + " | $" + option.price}
                                equipment={option.equipments.map(equipment => ({
                                    name: equipment.itemName,
                                    itemID: equipment.itemId,
                                    quantity: equipment.quantity
                                }))}
                                showQuantity={showQuantity}
                                addItem={addItem}
                                showReserve={showReserve}
                                fullpk={option}
                            />

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PackageDropdown;
