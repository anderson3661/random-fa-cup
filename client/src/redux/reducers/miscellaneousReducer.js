import { LOADING_APP, LOADING, LOADING_BACKEND_UPDATE, LOAD_FROM_MISCELLANEOUS_DB, LOAD_FROM_ALL_DBS_STARTED, LOAD_FROM_ALL_DBS_FINISHED, CREATE_DOCUMENTS_IN_DBS_FOR_FIRST_TIME, UPDATE_MISCELLANEOUS_PROPERTY } from '../actions/types';
import { FIRST_ROUND } from '../../utilities/constants';

const initialState = {
    hasCompetitionStarted: false,
    hasCompetitionFinished: false,
    competitionRoundForNextDraw: FIRST_ROUND,
    competitionRoundForPlay: FIRST_ROUND,
    okToProceedWithDraw: true,
    haveFixturesForCompetitionRoundBeenPlayed: false,
    haveFixturesProducedReplays: false,
    loadingApp: false,                                      // Used in App.js to initially load the app ... needs to be a separate loading key to the other loading keys
    loading: false,
    signingUpUser: false,
    loadingRefreshLatestFixtures: false,
    loadingRefreshHeaderAfterReplays: false,
    loadingRefreshHeaderAfterSemiFinals: false,
    loadingAfterEachPenalty: false,
    loadingBackendError: false,
}

export default function miscellaneousReducer(state = initialState, action) {
    switch (action.type) {

        case LOADING_APP :
        case LOADING :
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