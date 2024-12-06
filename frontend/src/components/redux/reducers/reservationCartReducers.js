import { SET_RESERVATION_CART_ITEMS, CLEAR_RESERVATION_CART_ITEMS } from '../actions/reservationCartActions';

const initialState = {
    reservationCartItems: [],
};

const reservationCartReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_RESERVATION_CART_ITEMS:
            return {
                ...state,
                reservationCartItems: action.payload,
            };
        case CLEAR_RESERVATION_CART_ITEMS:
            return {
                ...state,
                reservationCartItems: [],
            };
        default:
            return state;
    }
};

export default reservationCartReducer;
