// reservationCartActions.js

export const SET_RESERVATION_CART_ITEMS = 'SET_RESERVATION_CART_ITEMS';

export const setReservationCartItems = (items) => {
    return {
        type: SET_RESERVATION_CART_ITEMS,
        payload: items,
    };
};
