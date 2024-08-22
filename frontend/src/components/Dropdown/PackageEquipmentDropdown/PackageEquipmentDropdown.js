import React, { useState } from 'react'

function PackageEquipmentDropdown({ id, title, equipment }) {

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    };

    return (

        <div style={{ width: "100%", paddingRight: "10px" }}>
            <div className="package-dropdown-header">
                <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <div>{title}</div>
                    <button className="package-expand-button" onClick={toggleDropdown}> View Contents </button>
                </div>

            </div>

            {isOpen && (
                <div className="equipment-dropdown-content">
                    {equipment.map((option, index) => (
                        <div className="package-equipment-dropdown-item" key={index}>
                            {index + 1}. {option.itemID} | {option.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PackageEquipmentDropdown