import { combineReducers, applyMiddleware, legacy_createStore as createStore } from "redux";
import thunk from 'redux-thunk';
import {benefDataReducer, dateStatusReducer, dbDataReducer} from './reducers';

const rootReducer = combineReducers({
    benefData : benefDataReducer,
    dateStatus : dateStatusReducer,
    dbData : dbDataReducer,
})

const store = createStore(rootReducer, applyMiddleware(thunk))

export default store;
