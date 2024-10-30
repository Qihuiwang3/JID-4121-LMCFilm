import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import './CartConfirmation.css';
import EquipmentDropdown from '../../Dropdown/EquipmentDropdown/EquipmentDropdown';
import PackageDropdown from '../../Dropdown/PackageDropdown/PackageDropdown';
import axios from 'axios';
import Button from '../../Button/Button';
import { setReservationCartItems } from '../../redux/actions/reservationCartActions';

function CartConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { itemId } = location.state || {};
    const [equipment, setEquipment] = useState([]);
    const [packages, setPackages] = useState([]);

    const cartItems = useSelector(state => state.reservationCart.reservationCartItems);

    const [loading, setLoading] = useState(true);

    const handleContinue = () => {
        const cartTotal = calculateTotal();
        navigate('/Payment', { state: { cartTotal } });
        // navigate('/ReservationConfirmationMessagePage');
    };

    const handleBack = async () => {
        navigate('/ReservationPage');
        dispatch(setReservationCartItems(cartItems));
    }

    const calculateTotal = () => {
        let total = 0;
        cartItems.forEach(item => {
            total += item.price;
        });
        return total.toFixed(2);
    }

    const filterCartContent = () => {
        if (cartItems && cartItems.length > 0) {
            setEquipment(cartItems.filter(item => item.itemId));
            setPackages(cartItems.filter(item => item.bundleId));
        }
    }

    useEffect(() => {
        if (cartItems) {
            filterCartContent();
            setLoading(false); // Set loading to false after filtering
        }
    }, [cartItems])

    return (
        <div className="main-content">
            <div className="cart-confirm-container">
                <h1 style={{ paddingLeft: "50px", color: "#3361AE" }}>Cart</h1>
                <div className="cart-contents-container">
                    {!loading && (
                        <>
                            {equipment && equipment.length > 0 && (
                                <EquipmentDropdown
                                    id="equipment"
                                    title="Selected Equipment"
                                    equipment={equipment}
                                    showReserve={false}
                                    showQuantity={false}
                                />
                            )}

                            {packages && packages.length > 0 && (
                                <PackageDropdown
                                    id="packages"
                                    title="Selected Packages"
                                    pk={packages}
                                    showReserve={false}
                                    showQuantity={false}
                                />
                            )}

                        </>
                    )}
                    <div className="cart-total">Total: ${calculateTotal()} </div>
                </div>
            </div>
            <div className="btnContainer">
                <Button type="back" onClick={() => handleBack()}> Back </Button>
                <Button type="next" onClick={() => handleContinue()}> Continue </Button>
            </div>
        </div>
    )

}

export default CartConfirmation