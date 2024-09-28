import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import reducers from "./reducers/index";
import classReducer from './reducers/classReducers';
import studentReducer from './reducers/studentReducer';

const rootReducer = combineReducers({
    ...reducers, 
    classData: classReducer, 
    studentData: studentReducer
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;
