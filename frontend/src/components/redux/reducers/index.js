import { combineReducers } from "redux";
import cartReducers from "./cartReducers";
import reservationCartReducer from "./reservationCartReducers";

const rootReducer = combineReducers({
    cart: cartReducers,
    reservationCart: reservationCartReducer,
});

export default rootReducer;