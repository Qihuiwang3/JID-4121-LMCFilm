import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import PackageEquipmentDropdown from '../PackageEquipmentDropdown/PackageEquipmentDropdown.js';

import './PackageDropdown.css'

function PackageDropdown({ id, title, pk, addItem }) {

    const [isOpen, setIsOpen] = useState(false)

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
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
                                equipment={option.equipments}
                            />
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button className="package-reserve-button" onClick={() => addItem(option)}> Reserve </button>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    )
}

export default PackageDropdown