// reservationCartActions.js

export const SET_RESERVATION_CART_ITEMS = 'SET_RESERVATION_CART_ITEMS';

export const setReservationCartItems = (items) => {
    return {
        type: SET_RESERVATION_CART_ITEMS,
        payload: items,
    };
};

export const CLEAR_RESERVATION_CART_ITEMS = 'CLEAR_RESERVATION_CART_ITEMS';

export const clearReservationCartItems = () => {
    return {
        type: CLEAR_RESERVATION_CART_ITEMS,
    };
};

export const SET_TOTAL_VALUE = 'SET_TOTAL_VALUE';

export const setTotalValue = (totalValue) => ({
    type: SET_TOTAL_VALUE,
    payload: totalValue,
});
