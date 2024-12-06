import React, { useState, useEffect } from 'react';
import TimeSelectionButton from '../../Button/TimeSelectionButton/TimeSelectionButton.js';  // Keep the TimeSelectionButton
import EquipmentDropdown from '../../Dropdown/EquipmentDropdown/EquipmentDropdown.js';
import PackageDropdown from '../../Dropdown/PackageDropdown/PackageDropdown.js';
import './Reservation.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { setSelectedDates, setClassCode } from '../../redux/actions/classActions';
import { setReservationCartItems } from '../../redux/actions/reservationCartActions.js';
import { createCartWithData, getSingleItemsByClassCode, getBundleItemsByClassCode, getItemByName } from '../../../connector.js';
import Button from '../../Button/Button.js';

function ReservationPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const classCode = useSelector(state => state.classData.classCode);
    const selectedDates = useSelector(state => state.classData.selectedDates);
    const reservationCartItems = useSelector(state => state.reservationCart.reservationCartItems);
    const location = useLocation();
    const reduxStudentInfo = useSelector(state => state.studentData);
    const studentInfo = location.state?.studentInfo || reduxStudentInfo;

    const [pickupDateTime, setPickupDateTime] = useState(new Date(selectedDates?.pickupDateTime || new Date()));
    const [returnDateTime, setReturnDateTime] = useState(new Date(selectedDates?.returnDateTime || new Date()));

    const [equipment, setEquipment] = useState([]);
    const [bundles, setBundles] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    const [unpackedCartItems, setUnpackedCartItems] = useState([]);




    useEffect(() => {
        dispatch(setSelectedDates(pickupDateTime, returnDateTime));
        setCartItems(reservationCartItems);
    }, [pickupDateTime, returnDateTime, dispatch]);

    // const addToCart = (item) => {

    // const cartItem = cartItems.find(cartItem => cartItem.name === item.name);
    // const itemQuantityInCart = cartItem ? cartItems.filter(cartItem => cartItem.name === item.name).length : 0;
    // if (!cartItems.includes(item)) {
    //     if (itemQuantityInCart < item.quantity) {
    //         setCartItems([...cartItems, item]);  
    //     }
    // } else {
    //     setCartItems(cartItems.filter(cartItems => cartItems !== item));
    // }
    // };

    const addToCart = (item) => {

        console.log("item: ", item);
    
        const isBundle = !!item.bundleName; // Check if it's a bundle
    
        // Determine if the item or bundle already exists in the cart
        const existingCartItem = isBundle
            ? cartItems.find(cartItem => cartItem.bundleName === item.bundleName)
            : cartItems.find(cartItem => cartItem.name === item.name);
    
        // Calculate the quantity of the item currently in the cart
        const currentQuantity = cartItems.filter(cartItem =>
            isBundle
                ? cartItem.bundleName === item.bundleName
                : cartItem.name === item.name
        ).length;
    
        if (existingCartItem && currentQuantity >= item.quantity) {
            // Item quantity limit reached
            console.warn(`Cannot add more of ${item.name}. Maximum quantity reached.`);
            return;
        }
    
        const updatedCart = [...cartItems, { ...item, displayName: isBundle ? item.bundleName : item.name }];
        console.log("updatedCart: ", updatedCart);
    
        setCartItems(updatedCart);
        dispatch(setReservationCartItems(updatedCart)); // Sync with Redux
    };
    
    const removeFromCart = (item) => {
        console.log("Removing item: ", item);

        const isBundle = !!item.bundleName; // Check if it's a bundle

        // Remove only the first matching item or bundle
        const updatedCart = [...cartItems];
        const indexToRemove = updatedCart.findIndex(cartItem =>
            isBundle
                ? cartItem.bundleName === item.bundleName
                : cartItem.name === item.name
        );

        if (indexToRemove !== -1) {
            updatedCart.splice(indexToRemove, 1); // Remove the item at the found index
        }

        console.log("Updated cart after removal: ", updatedCart);
    
        setCartItems(updatedCart);
        dispatch(setReservationCartItems(updatedCart)); // Sync with Redux

        

    };
    
    
    

    const calculateTotal = () => {
        let total = 0;

        if (studentInfo.role === 'Admin' || studentInfo.role === 'Professor') {
            total = 0
        } else {
            cartItems.forEach(item => {
                total += item.price;
            });
        }

        return total.toFixed(2);
    };

    const handleCheckout = async () => {
        // Unpack bundles into individual items
        const unpackedItems = cartItems.flatMap(item => {
            if (item.bundleName && item.items) {
                // If it's a bundle, return its individual items
                return item.items.map(bundleItem => ({
                    ...bundleItem,
                    displayName: bundleItem.itemName,
                }));
            }
            // If it's a single item, return it as is
            return item;
        });
    
        console.log("Unpacked cart items: ", unpackedItems);
    
        setUnpackedCartItems(unpackedItems); // Update local state with unpacked items
    
        try {
            // Pass unpackedCartItems to the backend and navigate to confirmation
            const cartData = { cartItems: unpackedItems };
            await createCartWithData(cartData);
            navigate('/CartConfirmation', {
                state: { unpackedCartItems: unpackedItems, originalCartItems: cartItems },
            });
        } catch (error) {
            console.error('Error creating cart:', error);
        }
    };
    

    const handleBack = () => {
        dispatch(setClassCode(classCode));
        navigate('/Reservation', { state: { classCode } });
    };

    useEffect(() => {
        const fetchData = async () => {
            if (classCode) {
                try {
                    // Fetch single items
                    const singleItems = await getSingleItemsByClassCode(classCode);
                    const promises = singleItems.map(async (singleItem) => {
                        const itemDetails = await getItemByName(singleItem.itemName); // Updated
                        return {
                            ...singleItem,
                            pricePerItem: itemDetails.pricePerItem,
                            quantity: itemDetails.quantity
                        };
                    });

                    const equipmentWithPricesQuantity = await Promise.all(promises);
                    setEquipment(equipmentWithPricesQuantity);

                    // Fetch bundles
                    const bundleItems = await getBundleItemsByClassCode(classCode);
                    // console.log("bundleItems: ", bundleItems)
                    // console.log("bundleItems.items: ", bundleItems.items)
                    
                    setBundles(bundleItems);

                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        fetchData();
    }, [classCode]);

    // console.log("bundles: ", bundles)
    // console.log("bundles.length > 0 : ", bundles.length > 0 )


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
                    {equipment && equipment.length > 0 && (
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
                            showQuantity={true}
                            addItem={addToCart}
                        />
                    )}
                    {bundles && bundles.items && (
                        <PackageDropdown
                            id="packages"
                            title="Available Package"
                            bundle={bundles} 
                            addItem={addToCart}
                            showReserve={true}
                            showQuantity={false}
                        />
                    )}
                </div>

                <div className="cart-container">
                    <h1 style={{ paddingLeft: "20px", color: "#3361AE" }}>Cart</h1>
                    <div className="all-cart-items">
                        {cartItems.map(id => (
                            <div key={id.itemId || id.bundleId}>
                                <div className="cart-item">
                                    <div>
                                        <div className="cart-first-row">
                                            <div>{id.displayName}</div>
                                            <div> ${id.price}</div>
                                        </div>
                                        <div className="cart-second-row">
                                            <div className="remove-equipment-item" onClick={() => removeFromCart(id)}>Remove</div>
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