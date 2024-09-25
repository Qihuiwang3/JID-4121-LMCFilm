import { createStore, combineReducers } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import reducers from "./reducers/index";
import classReducer from './reducers/classReducers';

const rootReducer = combineReducers({
    ...reducers, 
    classData: classReducer, 
});

const store = createStore(rootReducer, composeWithDevTools());

export default store;
