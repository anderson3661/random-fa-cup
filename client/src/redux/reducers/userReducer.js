import { LOADING_APP, LOADING_BACKEND_UPDATE, LOAD_FROM_USERS_DB, USER_AUTHENTICATED, USER_LOGOUT } from '../actions/types';

const initialState = {
    emailAddress: '',
    authenticated: false,
    // emailAddress: 'm@m.com',
    // authenticated: true,
    // _id: '5c73d7380e7ad937b026c787',
}

export default function userReducer(state = initialState, action) {
    switch (action.type) {

        case LOADING_APP :
        case LOADING_BACKEND_UPDATE :
        case USER_AUTHENTICATED :
        case LOAD_FROM_USERS_DB :
        case USER_LOGOUT :
            return Object.assign({}, state, action.data);

        default:
            return state;
    }
}