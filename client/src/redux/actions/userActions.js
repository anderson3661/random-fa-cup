import { LOADING_BACKEND_UPDATE, LOAD_FROM_USERS_DB, USER_SIGNUP, USER_LOGIN, USER_LOGOUT, RESET_PASSWORD, CHANGE_PASSWORD, LOGOUT_AND_RESET_STATE_TO_DEFAULTS } from './types';
import { createOrUpdateDocumentInASingleDocumentDb } from '../../utilities/data-backend';
import { API_ENDPOINT_USER_SIGN_UP, API_ENDPOINT_USER_LOGIN, API_ENDPOINT_USER_LOGOUT, APP_STORAGE_KEY, API_ENDPOINT_USER_RESET_PASSWORD, API_ENDPOINT_USER_CHANGE_PASSWORD } from '../../utilities/constants';
import { loadFromAllDbsStarted } from './miscellaneousActions';
import { settingsResetApp } from './settingsActions';
import { getFromStorage, setInStorage, removeFromStorage } from '../../utilities/storage';

// ACTION CREATORS

export const userSignup = (userDetails) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: true, loadingBackendError: false }});
        dispatch({ type: USER_SIGNUP, data: { invalidMessage: '' }});
        dispatch({ type: LOAD_FROM_USERS_DB, data: { authenticated: false }});               // Make sure the user is not already logged in
        removeFromStorage(APP_STORAGE_KEY);                                                  // Remove the token from the browser's local storage, just in case
        const results = await createOrUpdateDocumentInASingleDocumentDb(userDetails, API_ENDPOINT_USER_SIGN_UP, 'User');
        if (results.success) {
            dispatch({ type: LOAD_FROM_USERS_DB, data: { ...results, authenticated: true, _id: results.userId }});     // The API call returns an object so update the store
            setInStorage(APP_STORAGE_KEY, results.token);                                                              // Add the token to the browser's local storage
            await dispatch(settingsResetApp(results.userId, false));                                                   // Need to reset the app (as is used on Settings)
        } else {
            dispatch({ type: USER_SIGNUP, data: { invalidMessage: results.message, }});
        }
        
        // After signing up the Settings screen is loaded.  Want to display a message to the new user to advise them to setup My Watchlist Teams.
        // Need to add a timeout so that the store is updated
        // Otherwise the signingUpUser: false is batched at the same time as signingUpUser: true, and therefore signingUpUser: true never happens
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: false, signingUpUser: true }});        
        setTimeout(() => {dispatch({ type: LOADING_BACKEND_UPDATE, data: { signingUpUser: false }});}, 500);
    } catch(error) {
        console.log('Error from userSignUp', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: false, signingUpUser: false, loadingBackendError: true }});
    }
}

export const userLogin = (userDetails) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: true, loadingBackendError: false }});
        dispatch({ type: USER_LOGIN, data: { invalidMessage: '' }});
        const results = await createOrUpdateDocumentInASingleDocumentDb(userDetails, API_ENDPOINT_USER_LOGIN, 'User Session');
        if (results.success) {
            dispatch({ type: LOAD_FROM_USERS_DB, data: { ...results, authenticated: true, _id: results.userId }});           // The API call returns an object so update the store
            setInStorage(APP_STORAGE_KEY, results.token);                                                                    // Add the token to the browser's local storage
            dispatch(loadFromAllDbsStarted());
        } else {
            dispatch({ type: USER_LOGIN, data: { invalidMessage: results.message, }});
        }
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: false }});
    } catch(error) {
        console.log('Error from userLogin', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: false, loadingBackendError: true }});
    }
}

export const userLogout = () => async (dispatch, getState) => {
    try {
        const userId = getState().default.user._id;
        const token = getFromStorage(APP_STORAGE_KEY);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: true, loadingBackendError: false }});
        dispatch({ type: USER_LOGOUT, data: { logoutInvalidMessage: '' }});
        if (token) removeFromStorage(APP_STORAGE_KEY);                                 // Remove the token from the browser's local storage, regardless of whether there is a user
        if (userId && token) {
            const results = await createOrUpdateDocumentInASingleDocumentDb({}, API_ENDPOINT_USER_LOGOUT, 'User Session', null, token);
            if (results.success) {
                dispatch({ type: LOGOUT_AND_RESET_STATE_TO_DEFAULTS });
                dispatch({ type: USER_LOGOUT, data: { authenticated: false }});
            } else {
                dispatch({ type: USER_LOGOUT, data: { logoutInvalidMessage: results.message, }});
            }
        }
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: false }});
    } catch(error) {
        console.log('Error from userLogout', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: false, loadingBackendError: true }});
    }
}

export const userResetPassword = (userDetails) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: true, loadingBackendError: false }});
        dispatch({ type: RESET_PASSWORD, data: { invalidMessage: '' }});
        dispatch({ type: LOAD_FROM_USERS_DB, data: { authenticated: false }});               // Make sure the user is not already logged in
        removeFromStorage(APP_STORAGE_KEY);                                                  // Remove the token from the browser's local storage, just in case
        const results = await createOrUpdateDocumentInASingleDocumentDb(userDetails, API_ENDPOINT_USER_RESET_PASSWORD, 'User');
        if (results.success) {
            dispatch({ type: LOAD_FROM_USERS_DB, data: { ...results, authenticated: true, _id: results.userId }});     // The API call returns an object so update the store
            setInStorage(APP_STORAGE_KEY, results.token);                                                              // Add the token to the browser's local storage
        } else {
            dispatch({ type: RESET_PASSWORD, data: { invalidMessage: results.message, }});
        }
    } catch(error) {
        console.log('Error from userResetPassword', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: false, loadingBackendError: true }});
    }
}

export const userChangePassword = (userDetails) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: true, loadingBackendError: false }});
        dispatch({ type: CHANGE_PASSWORD, data: { invalidMessage: '' }});
        dispatch({ type: LOAD_FROM_USERS_DB, data: { authenticated: false }});               // Make sure the user is not already logged in
        removeFromStorage(APP_STORAGE_KEY);                                                  // Remove the token from the browser's local storage, just in case
        const results = await createOrUpdateDocumentInASingleDocumentDb(userDetails, API_ENDPOINT_USER_CHANGE_PASSWORD, 'User');
        if (results.success) {
            dispatch({ type: LOAD_FROM_USERS_DB, data: { ...results, authenticated: true, _id: results.userId }});     // The API call returns an object so update the store
            setInStorage(APP_STORAGE_KEY, results.token);                                                              // Add the token to the browser's local storage
        } else {
            dispatch({ type: CHANGE_PASSWORD, data: { invalidMessage: results.message, }});
        }
    } catch(error) {
        console.log('Error from userChangePassword', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: false, loadingBackendError: true }});
    }
}
