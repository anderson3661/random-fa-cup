import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import * as reducers from './reducers/index';

const combinedReducers = combineReducers(reducers);

const RootReducer = (state, action) => {
    let user;
    let myWatchlistTeams;
    let settingsFactors;
    let teamsForCompetition;

    // This is a clever way to resets all state back to its default values, just by setting state to undefined
    // If resetting the app back to defaults, we don't want to reset the users or myWatchlistTeams
    // If resetting the app but keeping current settings, we don't want to reset the users, or myWatchlistTeams, or teams, or settings
    // However, if the user logs out then we DO want to reset the users
    if (action.type === 'RESET_STATE_TO_DEFAULTS' || action.type === 'RESET_STATE_KEEP_CURRENT_SETTINGS' || action.type === "LOGOUT_AND_RESET_STATE_TO_DEFAULTS") {
        if (action.type === 'RESET_STATE_TO_DEFAULTS') {
            user = state.default.user;
            myWatchlistTeams = state.default.myWatchlistTeams;
        } else if (action.type === 'RESET_STATE_KEEP_CURRENT_SETTINGS') {
            user = state.default.user;
            myWatchlistTeams = state.default.myWatchlistTeams;
            settingsFactors = state.default.settingsFactors;
            teamsForCompetition = state.default.teamsForCompetition;
        }
        state = undefined;
    }
    let allReducers = combinedReducers(state, action);

    // All of the state has been reset, so put back the saved values above
    if (action.type === 'RESET_STATE_TO_DEFAULTS') {
        allReducers.default.user = user;
        allReducers.default.myWatchlistTeams = myWatchlistTeams;
    } else if (action.type === 'RESET_STATE_KEEP_CURRENT_SETTINGS') {
        allReducers.default.user = user;
        allReducers.default.myWatchlistTeams = myWatchlistTeams;
        allReducers.default.settingsFactors = settingsFactors;
        allReducers.default.teamsForCompetition = teamsForCompetition;
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