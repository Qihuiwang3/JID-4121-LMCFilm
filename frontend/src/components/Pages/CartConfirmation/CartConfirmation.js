import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './CartConfirmation.css';
import EquipmentDropdown from '../../Dropdown/EquipmentDropdown/EquipmentDropdown';
import Button from '../../Button/Button';
import { useSelector } from 'react-redux';


function CartConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();

    const { unpackedCartItems, originalCartItems } = location.state || {};
    const [equipment, setEquipment] = useState([]);
    const totalValue = useSelector(state => state.reservationCart.totalValue);


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
                
                {totalValue && (
                    <div className="cart-total">Total: ${totalValue}</div>
                )}
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
