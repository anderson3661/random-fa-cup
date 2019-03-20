import { LOAD_FROM_MY_WATCHLIST_TEAMS_DB, MERGE_DOCUMENT_IDS_FROM_MY_WATCHLIST_TEAMS_DB, ADMIN_MY_WATCHLIST_TEAMS_SAVE_CHANGES, ADD_MY_WATCHLIST_TEAMS_IN_STORE } from '../actions/types';

const initialState = [];

export default function adminMyWatchlistTeamsReducer(state = initialState, action) {
    switch (action.type) {

        case LOAD_FROM_MY_WATCHLIST_TEAMS_DB :
        case MERGE_DOCUMENT_IDS_FROM_MY_WATCHLIST_TEAMS_DB :
        case ADMIN_MY_WATCHLIST_TEAMS_SAVE_CHANGES :
            return [...action.data];

        case ADD_MY_WATCHLIST_TEAMS_IN_STORE :
            return [...state.concat(action.data.myWatchlistTeams)];

        default:
            return state;
    }
}