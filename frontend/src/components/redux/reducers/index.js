import { combineReducers } from "redux";
import cartReducers from "./cartReducers";


const index = combineReducers({
  cart: cartReducers,
});

export default index;
