import React, { useState, useEffect } from 'react';
import TimeSelectionButton from '../../Button/TimeSelectionButton/TimeSelectionButton.js';
import EquipmentDropdown from '../../Dropdown/EquipmentDropdown/EquipmentDropdown.js';
import PackageDropdown from '../../Dropdown/PackageDropdown/PackageDropdown.js';
import './Reservation.css';
import { useNavigate, useLocation } from 'react-router-dom';

function ReservationPage({ selectedDates }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { classCode } = location.state || {};

    const initialPickupDateTime = mergeDateAndTime(selectedDates.pickupDate, selectedDates.pickupTime);
    const initialReturnDateTime = mergeDateAndTime(selectedDates.returnDate, selectedDates.returnTime);

    const [equipment, setEquipment] = useState([]);
    const [bundles, setBundles] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (item) => {

        if (!cartItems.includes(item)) {
            setCartItems([...cartItems, item]);
        } else {
            setCartItems(cartItems.filter(cartItems => cartItems !== item));
        }
    }

    const calculateTotal = () => {
        let total = 0;
        cartItems.forEach(item => {
            total += item.price;
        });
        return total.toFixed(2);
    }

    const handleCheckout = () => {
        navigate('/CartConfirmation', { state: { cartItems } });
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
                            }))
                    );

                    Promise.all(promises)
                        .then(equipmentWithPrices => {
                            setEquipment(equipmentWithPrices);
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
                    initialPickupDateTime={initialPickupDateTime}
                    initialReturnDateTime={initialReturnDateTime}
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
                            itemId: item._id
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
                    <h1 style={{ paddingLeft: "20px", color: "#3361AE" }}>
                        Cart
                    </h1>

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
                                            <div style={{ color: "#9C9C9C" }}> ID: {id.itemId || id.bundleId}</div>
                                            <div className="remove-equipment-item" onClick={() => addToCart(id)}> Remove </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: "right", paddingRight: "20px" }}> Total: ${calculateTotal()} </div>
                </div>
            </div>

            <div style={{ width: "100%", display: "flex", flexDirection: "row-reverse", paddingTop: "10px" }}>
                <div
                    className="equipment-checkout"
                    onClick={() => handleCheckout()}
                > Checkout </div>
            </div>
        </div >
    );
}

function mergeDateAndTime(date, time) {
    const merged = new Date(date);
    merged.setHours(time.getHours());
    merged.setMinutes(time.getMinutes());
    merged.setSeconds(time.getSeconds());
    return merged;
}

export default ReservationPage;
