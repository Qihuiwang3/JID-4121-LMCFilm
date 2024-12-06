import React, { useState } from 'react'

function PackageEquipmentDropdown({ id, title, equipment, showQuantity, showReserve, addItem, fullpk }) {

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    };

    return (

        <div style={{ width: "100%" }}>
            <div className="package-dropdown-header">
                <div style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <div>{title}</div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <button className="package-expand-button" onClick={toggleDropdown}> View Contents </button>
                        {showReserve && (
                            <div className="general-reserve-button">
                                <button 
                                    className="package-reserve-button" 
                                    onClick={() => addItem(fullpk)}
                                > 
                                    Reserve 
                                </button>
                            </div>
                        )}
                    </div>

                </div>



            </div>

            {isOpen && (
                <div className="equipment-dropdown-content">
                    {equipment.map((option, index) => (
                        <div className="package-equipment-dropdown-item" key={index}>
                            {index + 1}. {option.name} {showQuantity && ` | Quantity: ${option.quantity}`}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PackageEquipmentDropdown