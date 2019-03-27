import { LOADING_APP, LOADING_BACKEND_UPDATE, LOAD_FROM_USERS_DB, USER_AUTHENTICATION, USER_SIGNUP } from '../actions/types';

const initialState = {
    emailAddress: '',
    authenticated: false,
    authenticationAttempted: false,
    signUpAttempted: false,
    signUpUserAlreadyExists: false,
    
    // emailAddress: 'm@m.com',
    // authenticated: true,
    // _id: '5c7a2fb8f6f0801140ae065f',
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