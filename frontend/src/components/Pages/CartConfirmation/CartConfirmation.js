import React, { useState } from 'react';
import './CartConfirmation.css';
import EquipmentDropdown from '../../Dropdown/EquipmentDropdown/EquipmentDropdown';
import PackageDropdown from '../../Dropdown/PackageDropdown/PackageDropdown';

function CartConfirmation() {

    return (
        <div className="cart-confirm-body">
            <div className="cart-confirm-container">

                <h1 style={{ paddingLeft: "50px", color: "#3361AE" }}>Cart</h1>

                <div className="cart-contents-container">

                    asd

                    <EquipmentDropdown
                        id="equipment"
                        title="Selected Equipment"
                        equipment={null}
                        showReserve={false}
                    />

                    <PackageDropdown
                        id="packages"
                        title="Selected Packages"
                        pk={null}
                        showReserve={false}
                    />
                </div>

            </div>
        </div>
    )

}

export default CartConfirmation