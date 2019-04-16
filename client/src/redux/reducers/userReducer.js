import { TESTING_MODE, APP_STORAGE_KEY } from '../../utilities/constants';
import { LOADING_APP, LOADING_BACKEND_UPDATE, LOAD_FROM_USERS_DB, USER_SIGNUP, USER_LOGIN, USER_LOGOUT, RESET_PASSWORD, CHANGE_PASSWORD } from '../actions/types';
import { getFromStorage } from '../../utilities/storage';

const initialState = {
    authenticated: TESTING_MODE ? true : getFromStorage(APP_STORAGE_KEY) !== null,                  // Check local storage to see if a token is stored there ... if yes, then the user doesn't need to login
    _id: getFromStorage(APP_STORAGE_KEY),
    signUpInvalidMessage: '',
    loginInvalidMessage: '',
    logoutInvalidMessage: '',
}

export default function userReducer(state = initialState, action) {
    switch (action.type) {

        case LOADING_APP :
        case LOADING_BACKEND_UPDATE :
        case USER_SIGNUP :
        case USER_LOGIN :
        case USER_LOGOUT :
        case RESET_PASSWORD :
        case CHANGE_PASSWORD :
        case LOAD_FROM_USERS_DB :
            return Object.assign({}, state, action.data);

        default:
            return state;
    }
}