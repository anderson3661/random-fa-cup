import { LOADING_BACKEND_UPDATE, LOAD_FROM_USERS_DB, USER_AUTHENTICATED } from './types';
import { isUserAuthenticated, createDocumentInASingleDocumentDb } from '../../utilities/data-backend';
import { API_ENDPOINT_USERS } from '../../utilities/constants';
import { loadFromAllDbsStarted } from './miscellaneousActions';

// ACTION CREATORS

export const userLogin = (userDetails) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingUser: true }});
        debugger;
        const results = await isUserAuthenticated(userDetails);
        debugger;
        dispatch({ type: USER_AUTHENTICATED, data: results });
        debugger;
        dispatch(loadFromAllDbsStarted());
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingUser: false }});
    } catch(error) {
        console.log('Error from userLogin', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingUser: false, loadingBackendError: true }});
    }
}

export const userSignup = (userDetails) => async (dispatch) => {
    try {
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingUser: true }});
        const results = await createDocumentInASingleDocumentDb(userDetails, API_ENDPOINT_USERS, 'User');
        debugger;
        dispatch({ type: LOAD_FROM_USERS_DB, data: { ...results, authenticated: true }});            // The API call returns an object so update the store
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingUser: false }});
    } catch(error) {
        console.log('Error from userSignUp', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingUser: false, loadingBackendError: true }});
    }
}
