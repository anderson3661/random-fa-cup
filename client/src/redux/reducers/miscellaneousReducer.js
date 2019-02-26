import { LOADING_APP, LOAD_FROM_MISCELLANEOUS_DB, LOAD_FROM_ALL_DBS_STARTED, LOAD_FROM_ALL_DBS_FINISHED, CREATE_DOCUMENTS_IN_DBS_FOR_FIRST_TIME, UPDATE_MISCELLANEOUS_PROPERTY, LOADING_BACKEND_UPDATE } from '../actions/types';

const initialState = {
    haveSeasonsFixturesBeenCreated: false,
    hasSeasonStarted: false,
    hasSeasonFinished: false,
    dateOfLastSetOfFixtures: '',
    createDocumentsInDbsForFirstTime: false,
    loading: false,
    loadingUser: false,
    loadingAdmin: false,
    loadingLatestFixtures: false,
    loadingBackendError: false,
}

export default function miscellaneousReducer(state = initialState, action) {
    switch (action.type) {

        case LOADING_APP :
        case LOADING_BACKEND_UPDATE :
        case LOAD_FROM_MISCELLANEOUS_DB :
        case LOAD_FROM_ALL_DBS_STARTED :
        case LOAD_FROM_ALL_DBS_FINISHED :
        case CREATE_DOCUMENTS_IN_DBS_FOR_FIRST_TIME :
        case UPDATE_MISCELLANEOUS_PROPERTY :
            return Object.assign({}, state, action.data);

        default:
            return state;
    }
}