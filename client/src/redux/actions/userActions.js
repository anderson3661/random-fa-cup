import { LOADING_BACKEND_UPDATE, LOAD_FROM_USERS_DB, USER_SIGNUP, USER_LOGIN, USER_LOGOUT, LOGOUT_AND_RESET_STATE_TO_DEFAULTS } from './types';
import { createDocumentInASingleDocumentDb } from '../../utilities/data-backend';
import { API_ENDPOINT_USER_SIGN_UP, API_ENDPOINT_USER_LOGIN, API_ENDPOINT_USER_LOGOUT } from '../../utilities/constants';
import { loadFromAllDbsStarted } from './miscellaneousActions';
import { settingsResetApp } from './settingsActions';

// ACTION CREATORS

export const userSignup = (userDetails) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingUser: true }});
        dispatch({ type: USER_SIGNUP, data: { signUpInvalidMessage: '' }});
        const results = await createDocumentInASingleDocumentDb(userDetails, API_ENDPOINT_USER_SIGN_UP, 'User');
        if (results.success) {
            dispatch({ type: LOAD_FROM_USERS_DB, data: { ...results, authenticated: true, _id: results.userId }});     // The API call returns an object so update the store
            dispatch(settingsResetApp());                                                                              // Need to reset the app (as is used on Settings)
        } else {
            dispatch({ type: USER_SIGNUP, data: { signUpInvalidMessage: results.message, }});
        }
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingUser: false }});
    } catch(error) {
        console.log('Error from userSignUp', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingUser: false, loadingBackendError: true }});
    }
}

export const userLogin = (userDetails) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingUser: true }});
        dispatch({ type: USER_LOGIN, data: { loginInvalidMessage: '' }});
        const results = await createDocumentInASingleDocumentDb(userDetails, API_ENDPOINT_USER_LOGIN, 'User Session');
        debugger;
        if (results.success) {
            dispatch({ type: LOAD_FROM_USERS_DB, data: { ...results, authenticated: true, _id: results.userId }});           // The API call returns an object so update the store
            dispatch(loadFromAllDbsStarted());
        } else {
            dispatch({ type: USER_LOGIN, data: { loginInvalidMessage: results.message, }});
        }
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingUser: false }});
    } catch(error) {
        console.log('Error from userLogin', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingUser: false, loadingBackendError: true }});
    }
}

export const userLogout = (userDetails) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingUser: true }});
        dispatch({ type: USER_LOGOUT, data: { logoutInvalidMessage: '' }});
        const results = await createDocumentInASingleDocumentDb(userDetails, API_ENDPOINT_USER_LOGOUT, 'User Session');
        if (results.success) {
            dispatch({ type: LOGOUT_AND_RESET_STATE_TO_DEFAULTS });
        } else {
            dispatch({ type: USER_LOGOUT, data: { logoutInvalidMessage: results.message, }});
        }
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingUser: false }});
    } catch(error) {
        console.log('Error from userLogout', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingUser: false, loadingBackendError: true }});
    }
}
