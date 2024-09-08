import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CartConfirmation.css';
import EquipmentDropdown from '../../Dropdown/EquipmentDropdown/EquipmentDropdown';
import PackageDropdown from '../../Dropdown/PackageDropdown/PackageDropdown';
import axios from 'axios';

function CartConfirmation() {

    const location = useLocation();
    const navigate = useNavigate();

    const { cartItems, itemId } = location.state || {};

    const [equipment, setEquipment] = useState({});
    const [packages, setPackages] = useState({});

    const handleContinue = () => {
        const cartTotal = calculateTotal();
        navigate('/Payment', { state: { cartTotal } });
    };

    const handleBack = async () => {
        try {
            await axios.delete(`http://localhost:3500/api/carts/${itemId}`);
        } catch (error) {
            
            console.error('Backend not started:', error.message || error);
            
        
        } finally {
            
            navigate('/ReservationPage');
        }
    }

    const calculateTotal = () => {
        let total = 0;
        cartItems.forEach(item => {
            total += item.price;
        });
        return total.toFixed(2);
    }

    const filterCartContent = () => {
        // console.log(cartItems);
        if (cartItems && cartItems.length > 0) {
            setEquipment(cartItems.filter(item => item.itemId));
            setPackages(cartItems.filter(item => item.bundleId));
        }
        console.log(equipment);
        console.log(packages);

    }

    useEffect(() => {
        filterCartContent();
    }, [cartItems])

    return (
        <div className="cart-confirm-body">
            <div className="cart-confirm-container">

                <h1 style={{ paddingLeft: "50px", color: "#3361AE" }}>Cart</h1>

                <div className="cart-contents-container">

                    <EquipmentDropdown
                        id="equipment"
                        title="Selected Equipment"
                        equipment={equipment}
                        showReserve={false}
                    />

                    <PackageDropdown
                        id="packages"
                        title="Selected Packages"
                        pk={packages}
                        showReserve={false}
                    />

                    <div className="cart-total">Total: ${calculateTotal()} </div>

                    <div className="button-footers">
                        <div className="button-back" onClick={() => handleBack()}> Back </div>
                        <div className="button-continue" onClick={() => handleContinue()}> Continue </div>
                    </div>

                </div>


            </div>
        </div>
    )

}

export default CartConfirmation