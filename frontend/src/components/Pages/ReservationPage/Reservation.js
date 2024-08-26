import React, { useState, useEffect } from 'react';
import TimeSelectionButton from '../../Button/TimeSelectionButton/TimeSelectionButton.js';
import EquipmentDropdown from '../../Dropdown/EquipmentDropdown/EquipmentDropdown.js';
import PackageDropdown from '../../Dropdown/PackageDropdown/PackageDropdown.js';
import './Reservation.css';

// comment this out if you want to test backend function
// import { getStudents } from '../../../connector.js';
// import { createCart } from '../../../connector.js';
import { collection, onSnapshot } from 'firebase/firestore';
import db from "../firebase";

function ReservationPage({ selectedDates }) {
    const initialPickupDateTime = mergeDateAndTime(selectedDates.pickupDate, selectedDates.pickupTime);
    const initialReturnDateTime = mergeDateAndTime(selectedDates.returnDate, selectedDates.returnTime);

    // define equipment array
    const [cameras, setCameras] = useState([]);
    const [lights, setLights] = useState([]);
    const [packages, setPackages] = useState([]);

    //cart items
    const [cartItems, setCartItems] = useState([]);

    //add to cart
    const addToCart = (id) => {
        if (!cartItems.includes(id)) {
            setCartItems([...cartItems, id]);
        } else {
            setCartItems(cartItems.filter(cartItems => cartItems !== id));
        }
    }

    //total of items in cart
    const calculateTotal = () => {
        let total = 0;
        cartItems.forEach(item => {
            total += item.price
        })
        return total.toFixed(2);
    }

    // // comment this out if you want to test backend function
    // const testBackendStudent = async () => {
    //     try {
    //         const students = await getStudents();
    //         console.log("students: ", students)
    //     } catch (error) {
    //         console.error('Error fetching students:', error);
    //     }
    // };

    // const createNewCart = async () => {
    //     try {
    //         const data = {
    //             "itemId": "9999",
    //             "price": 29.99,
    //             "quantity": 2
    //         }
    //         const cart = await createCart(data);
    //         console.log("cart: ", cart)
    //     } catch (error) {
    //         console.error('Error fetching students:', error);
    //     }
    // }

    //on page load get equipment and define "packages"
    useEffect(() => {

        onSnapshot(collection(db, "Equipment"), (snapshot) => {

            // filter into arrays of equipment type
            const cameras = snapshot.docs
                .filter(doc => doc.data().hasOwnProperty("type") && doc.data().type === "camera")
                .map((doc) => doc.data())
                .sort((a, b) => b.Score - a.Score);
            setCameras(cameras);

            const lights = snapshot.docs
                .filter(doc => doc.data().hasOwnProperty("type") && doc.data().type === "light")
                .map((doc) => doc.data())
                .sort((a, b) => b.Score - a.Score);
            setLights(lights);

            // create packages THESE ARE HARDCODED FOR NOW

            const p1 = snapshot.docs
                .map((doc) => doc.data())
                .sort((a, b) => b.Score - a.Score)
                .slice(0, 2);

            const p2 = snapshot.docs
                .filter(doc => doc.data().hasOwnProperty("type") && doc.data().type === "light")
                .map((doc) => doc.data())
                .sort((a, b) => b.Score - a.Score)
                .reverse()
                .slice(0, 2);

            setPackages([{ equipments: p1, price: 14.99, name: "Package Bundle A", itemID: "952108" }, { equipments: p2, price: 20.99, name: "Package Bundle B", itemID: "987654" }])

        });

    }, [])


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
                        id="cameras"
                        title="Cameras"
                        equipment={cameras}
                        addItem={addToCart}
                    />

                    <EquipmentDropdown
                        id="lights"
                        title="Lights"
                        equipment={lights}
                        addItem={addToCart}
                    />

                    <PackageDropdown
                        id="packages"
                        title="Packages"
                        pk={packages}
                        addItem={addToCart}
                    />
                </div>

                <div className="cart-container">
                    <h1 style={{ paddingLeft: "20px", color: "#3361AE" }}>
                        Cart
                    </h1>

                    <div className="all-cart-items">
                        {cartItems.map(id => (

                            <div>
                                <div className="cart-item">
                                    <div key={id}>
                                        <div className="cart-first-row">
                                            <div>{id.name}</div>
                                            <div> ${id.price}</div>
                                        </div>
                                        <div className="cart-second-row">
                                            <div style={{ color: "#9C9C9C" }}> ID: {id.itemID}</div>
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
                <div className="equipment-checkout"> Checkout </div>
            </div>

            {/* comment this out if you want to test backend function */}

            {/* <button
                className="bg-red-400 rounded-md p-2 font-bold"
                onClick={() => testBackendStudent()}
              >
                Test
              </button> */}


            {/* <button
                className="bg-red-400 rounded-md p-2 font-bold"
                onClick={() => createNewCart()}
              >
                Test
              </button> */}
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