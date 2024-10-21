import React, { useState, useEffect } from 'react';
import TimeSelectionButton from '../../Button/TimeSelectionButton/TimeSelectionButton.js';  // Keep the TimeSelectionButton
import EquipmentDropdown from '../../Dropdown/EquipmentDropdown/EquipmentDropdown.js';
import PackageDropdown from '../../Dropdown/PackageDropdown/PackageDropdown.js';
import './Reservation.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSelectedDates, setClassCode } from '../../redux/actions/classActions';
import { setReservationCartItems } from '../../redux/actions/reservationCartActions.js';
import { createCartWithData } from '../../../connector.js';
import Button from '../../Button/Button.js';

function ReservationPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const classCode = useSelector(state => state.classData.classCode);
    const selectedDates = useSelector(state => state.classData.selectedDates);
    const reservationCartItems = useSelector(state => state.reservationCart.reservationCartItems);

    const [pickupDateTime, setPickupDateTime] = useState(new Date(selectedDates?.pickupDateTime || new Date()));
    const [returnDateTime, setReturnDateTime] = useState(new Date(selectedDates?.returnDateTime || new Date()));

    const [equipment, setEquipment] = useState([]);
    const [bundles, setBundles] = useState([]);
    const [cartItems, setCartItems] = useState([]);


    useEffect(() => {
        dispatch(setSelectedDates(pickupDateTime, returnDateTime));
        setCartItems(reservationCartItems);
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
        dispatch(setReservationCartItems(cartItems));
        try {
            const response = await createCartWithData(cartData);
            console.log('Cart created:', response);
            navigate('/CartConfirmation', { state: { cartItems } });
            console.log(cartItems);
        } catch (error) {
            console.error('Error creating cart:', error);
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
        <div className="main-content">
            <div className='reservation-header'>
                <h1 className="reservation-header-text">Reservation</h1>
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
                        showQuantity={false}
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
                        showQuantity={false}
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

            <div className='btnContainer'>
                <Button type="back" onClick={handleBack}>Back</Button>
                {/* Conditionally render the checkout button */}
                {cartItems.length === 0 ? null : (
                    <Button type="next" onClick={handleCheckout}>
                        Checkout
                    </Button>
                )}
            </div >
        </div >
    );
}

export default ReservationPage;
