import { ActionTypes } from "../constants/action-types";

export const setCartPrice = (cartPrice) => {
    return {
        type: ActionTypes.SET_CART_PRICE,
        payload: cartPrice,
    };
};

export const updateCartPrice = (cartPrice) => {
    return {
        type: ActionTypes.UPDATE_CART_PRICE,
        payload: cartPrice,
    };
};


