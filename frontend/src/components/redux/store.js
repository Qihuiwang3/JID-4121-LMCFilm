import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import reducers from "./reducers/index";
import classReducer from './reducers/classReducers';
import studentReducer from './reducers/studentReducer';
import reservationCartReducer from './reducers/reservationCartReducers';
import authReducer from './reducers/authSlice';

const rootReducer = combineReducers({
    ...reducers,
    classData: classReducer,
    studentData: studentReducer,
    reservationCart: reservationCartReducer,
    auth: authReducer
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;
