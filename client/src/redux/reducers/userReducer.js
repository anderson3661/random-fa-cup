import { TESTING_MODE, TESTING_EMAIL_ADDRESS, TESTING_USER_ID_KEY, TESTING_USER_ID } from '../../utilities/constants';
import { LOADING_APP, LOADING_BACKEND_UPDATE, LOAD_FROM_USERS_DB, USER_AUTHENTICATION, USER_SIGNUP } from '../actions/types';

const initialState = {
    emailAddress: TESTING_MODE ? TESTING_EMAIL_ADDRESS : '',
    authenticated: TESTING_MODE,
    authenticationAttempted: false,
    signUpAttempted: false,
    signUpUserAlreadyExists: false,
    [TESTING_MODE ? TESTING_USER_ID_KEY : '']: TESTING_USER_ID,
}

export default function userReducer(state = initialState, action) {
    switch (action.type) {

        case LOADING_APP :
        case LOADING_BACKEND_UPDATE :
        case USER_AUTHENTICATION :
        case USER_SIGNUP :
        case LOAD_FROM_USERS_DB :
            return Object.assign({}, state, action.data);

        default:
            return state;
    }
}