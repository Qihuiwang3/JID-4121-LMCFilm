// reservationCartReducer.js

import { SET_RESERVATION_CART_ITEMS } from '../actions/reservationCartActions';

const initialState = {
    reservationCartItems: [], // Initialize your state with an empty array
};

const reservationCartReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_RESERVATION_CART_ITEMS:
            return {
                ...state,
                reservationCartItems: action.payload, // Update the state with the new items
            };
        default:
            return state; // Return the current state by default
    }
};

export default reservationCartReducer;
