import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CartConfirmation.css';
import EquipmentDropdown from '../../Dropdown/EquipmentDropdown/EquipmentDropdown';
import Button from '../../Button/Button';

function CartConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();

    const { unpackedCartItems, originalCartItems } = location.state || {};
    const [equipment, setEquipment] = useState([]);

    const handleBack = () => {
        // Navigate back to the ReservationPage with the original cart
        navigate('/ReservationPage', { state: { cartItems: originalCartItems } });
    };

    useEffect(() => {
        if (unpackedCartItems) {
            // Separate unpacked items into equipment and packages
            const equipmentItems = unpackedCartItems.filter(item => !item.bundleName);
            console.log("equipmentItems: ", equipmentItems)

            setEquipment(equipmentItems);
        }
    }, [unpackedCartItems]);

    const calculateTotal = () => {
        return unpackedCartItems
            ? unpackedCartItems.reduce((total, item) => total + item.price, 0).toFixed(2)
            : '0.00';
    };

    return (
        <div className="main-content">
            <h1 className="cart-header-text">Cart Confirmation</h1>
            <div className="cart-contents-container">
                {equipment.length > 0 && (
                    <EquipmentDropdown
                        id="equipment"
                        title="Equipment"
                        equipment={equipment}
                        showReserve={false}
                    />
                )}
                <div className="cart-total">Total: ${calculateTotal()}</div>
            </div>
            <div className="btnContainer">
                <Button type="back" onClick={handleBack}>
                    Back
                </Button>
                <Button type="next" onClick={() => navigate('/Payment')}>
                    Continue
                </Button>
            </div>
        </div>
    );
}

export default CartConfirmation;
