import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import './EquipmentDropdown.css'

function EquipmentDropdown({ title, equipment, addItem, showReserve }) {

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    };

    return (

        <div className="equipment-dropdown">
            <div className="equipment-dropdown-header" onClick={toggleDropdown}>
                <div>
                    {title}
                </div>
                <div className='equipment-dropdown-arrow'>
                    <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown} onClick={toggleDropdown} />
                </div>
            </div>

            {isOpen && (
                <div className="equipment-dropdown-content">
                    {equipment.map((option, index) => (
                        <div className="equipment-dropdown-item" key={index}>
                            <div> {index + 1}. {option.name} | ${option.price}</div>


                            {showReserve && (
                                <button className="equipment-reserve-button" onClick={() => addItem(option)}> Reserve </button>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default EquipmentDropdown