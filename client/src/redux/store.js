import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import * as reducers from './reducers/index';

const combinedReducers = combineReducers(reducers);

const RootReducer = (state, action) => {
    let user;
    let myWatchlistTeams;

    // This is a clever way to resets all state back to its default values, just by setting state to undefined
    // If resetting the app back to defaults, we don't want to reset the users or myWatchlistTeams
    // However, if the user logs out then we do want to reset the users
    if (action.type === 'RESET_STATE_TO_DEFAULTS' || action.type === "LOGOUT_AND_RESET_STATE_TO_DEFAULTS") {
        debugger;
        if (action.type === 'RESET_STATE_TO_DEFAULTS') user = state.default.user;
        myWatchlistTeams = state.default.myWatchlistTeams;
        state = undefined;
    }
    let allReducers = combinedReducers(state, action);

    if (action.type === 'RESET_STATE_TO_DEFAULTS' || action.type === "LOGOUT_AND_RESET_STATE_TO_DEFAULTS") {
        if (action.type === 'RESET_STATE_TO_DEFAULTS') allReducers.default.user = user;
        allReducers.default.myWatchlistTeams = myWatchlistTeams;
    }

    return allReducers;
}

// const initialState = {};

const middleware = [thunk];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(RootReducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(...middleware)
));

export default store;