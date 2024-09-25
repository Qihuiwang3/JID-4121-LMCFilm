import React, { useState, useEffect } from 'react';
import TimeSelectionButton from '../../Button/TimeSelectionButton/TimeSelectionButton.js';  // Keep the TimeSelectionButton
import EquipmentDropdown from '../../Dropdown/EquipmentDropdown/EquipmentDropdown.js';
import PackageDropdown from '../../Dropdown/PackageDropdown/PackageDropdown.js';
import './Reservation.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedDates, setClassCode } from '../../redux/actions/classActions';
import axios from 'axios';

function ReservationPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const classCode = useSelector(state => state.classData.classCode);
    const selectedDates = useSelector(state => state.classData.selectedDates);

    const [pickupDateTime, setPickupDateTime] = useState(new Date(selectedDates?.pickupDateTime || new Date()));
    const [returnDateTime, setReturnDateTime] = useState(new Date(selectedDates?.returnDateTime || new Date()));

    const [equipment, setEquipment] = useState([]);
    const [bundles, setBundles] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        dispatch(setSelectedDates(pickupDateTime, returnDateTime));
    }, [pickupDateTime, returnDateTime, dispatch]);

    const addToCart = (item) => {
        if (!cartItems.includes(item)) {
            setCartItems([...cartItems, item]);
        } else {
            setCartItems(cartItems.filter(cartItems => cartItems !== item));
        }
    };

    const calculateTotal = () => {
        let total = 0;
        cartItems.forEach(item => {
            total += item.price;
        });
        return total.toFixed(2);
    };

    const handleCheckout = async () => {
        const cartData = { cartItems };
        try {
            const response = await axios.post('http://localhost:3500/api/carts', cartData);
            console.log('Cart created:', response.data);
        } catch (error) {
            console.error('Backend not started:', error.message || error);
        } finally {
            navigate('/CartConfirmation', { state: { cartItems } });
        }
    };

    const handleBack = () => {
        dispatch(setClassCode(classCode));
        navigate('/Reservation', { state: { classCode } });
    };

    useEffect(() => {
        if (classCode) {
            // Fetch single items
            fetch(`http://localhost:3500/api/single-items/${classCode}`)
                .then(res => res.json())
                .then(data => {
                    const promises = data.map(singleItem =>
                        fetch(`http://localhost:3500/api/item/${singleItem.itemName}`)
                            .then(res => res.json())
                            .then(itemDetails => ({
                                ...singleItem,
                                pricePerItem: itemDetails.pricePerItem,
                                quantity: itemDetails.quantity
                            }))
                    );

                    Promise.all(promises)
                        .then(equipmentWithPricesQuantity => {
                            setEquipment(equipmentWithPricesQuantity);
                        })
                        .catch(error => console.error('Error fetching item prices:', error));
                })
                .catch(error => console.error('Error fetching equipment:', error));

            // Fetch bundles
            fetch(`http://localhost:3500/api/bundle-items/${classCode}`)
                .then(res => res.json())
                .then(data => {
                    setBundles(data);
                })
                .catch(error => console.error('Error fetching bundles:', error));
        }
    }, [classCode]);

    return (
        <div className="main-reservation-equipment-cart">
            <div style={{ display: "flex", paddingTop: "100px", justifyContent: "space-between", width: "60%" }}>
                <h1 style={{ paddingLeft: "50px", color: "#3361AE" }}> Reservation </h1>
                <TimeSelectionButton
                    initialPickupDateTime={pickupDateTime}
                    initialReturnDateTime={returnDateTime} 
                    onPickupDateTimeChange={setPickupDateTime} 
                    onReturnDateTimeChange={setReturnDateTime} 
                />
            </div>

            <div className="equipment-and-cart">
                <div className="equipment-container">
                    <EquipmentDropdown
                        id="equipment"
                        title="Available Equipment"
                        equipment={equipment.map(item => ({
                            name: item.itemName,
                            price: item.pricePerItem,
                            itemId: item._id,
                            quantity: item.quantity
                        }))}
                        showReserve={true}
                        addItem={addToCart}
                    />

                    <PackageDropdown
                        id="packages"
                        title="Available Packages"
                        pk={bundles.map(bundle => ({
                            name: bundle.bundleName,
                            price: bundle.price,
                            equipments: bundle.items,
                            bundleId: bundle._id
                        }))}
                        showReserve={true}
                        addItem={addToCart}
                    />
                </div>

                <div className="cart-container">
                    <h1 style={{ paddingLeft: "20px", color: "#3361AE" }}>Cart</h1>
                    <div className="all-cart-items">
                        {cartItems.map(id => (
                            <div key={id.itemId || id.bundleId}>
                                <div className="cart-item">
                                    <div>
                                        <div className="cart-first-row">
                                            <div>{id.name}</div>
                                            <div> ${id.price}</div>
                                        </div>
                                        <div className="cart-second-row">
                                            <div className="remove-equipment-item" onClick={() => addToCart(id)}>Remove</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: "right", paddingRight: "20px" }}>Total: ${calculateTotal()}</div>
                </div>
            </div>

            <div className='equipment-button-container'>
                <div className="equipment-back" onClick={handleBack}>Back</div>
                <div className="equipment-checkout" onClick={() => handleCheckout()}> Checkout </div>
            </div>
        </div>
    );
}

export default ReservationPage;
