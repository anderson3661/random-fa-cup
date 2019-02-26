import { LOAD_FROM_LEAGUE_TABLE_DB, MERGE_DOCUMENT_IDS_FROM_LEAGUE_TABLE_DB, UPDATE_LEAGUE_TABLE_IN_STORE_AFTER_RESULTS } from '../actions/types';
import { TEAMS_DEFAULT } from '../../utilities/constants';
import { createLeagueTable } from '../../utilities/data';

const initialState = createLeagueTable(TEAMS_DEFAULT);

export default function leagueTableReducer(state = initialState, action) {
    switch (action.type) {

        case LOAD_FROM_LEAGUE_TABLE_DB :
        case MERGE_DOCUMENT_IDS_FROM_LEAGUE_TABLE_DB :
            return [...action.data];

        case UPDATE_LEAGUE_TABLE_IN_STORE_AFTER_RESULTS :
            return [...action.data.leagueTable];

        default:
            return state;
    }
}