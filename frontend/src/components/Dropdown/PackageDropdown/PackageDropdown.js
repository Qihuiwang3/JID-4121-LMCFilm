import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import PackageEquipmentDropdown from '../PackageEquipmentDropdown/PackageEquipmentDropdown.js';
import './PackageDropdown.css';

function PackageDropdown({ id, title, bundle, addItem, showReserve, showQuantity }) {
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
                    <div className="package-dropdown-item">
                        <PackageEquipmentDropdown
                            id="bundle"
                            title={`${bundle.bundleName} | $${bundle.price}`}
                            equipment={bundle.items.map(equipment => ({
                                name: equipment.itemName,
                                quantity: equipment.quantity,
                                itemID: equipment._id,
                            }))}
                            showQuantity={showQuantity}
                            addItem={addItem}
                            showReserve={showReserve}
                            fullpk={bundle}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default PackageDropdown;
