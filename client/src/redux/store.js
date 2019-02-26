import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import * as reducers from './reducers/index';

const allReducers = combineReducers(reducers);

const RootReducer = (state, action) => {
    // This is a clever way to resets all state back to its default values, just by setting state to undefined
    if (action.type === 'RESET_STATE_TO_DEFAULTS') {
        state = undefined;
    }
    return allReducers(state, action);
}

// const initialState = {};

const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(RootReducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(...middleware)
));

export default store;