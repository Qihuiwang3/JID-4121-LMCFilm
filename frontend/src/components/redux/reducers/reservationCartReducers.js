import { SET_RESERVATION_CART_ITEMS, CLEAR_RESERVATION_CART_ITEMS, SET_TOTAL_VALUE } from '../actions/reservationCartActions';

const initialState = {
    reservationCartItems: [],
    totalValue: 0
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
        case SET_TOTAL_VALUE:
            return {
                ...state,
                totalValue: action.payload,
            };
        default:
            return state;
    }
};

export default reservationCartReducer;