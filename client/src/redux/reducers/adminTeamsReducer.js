import { LOAD_FROM_TEAMS_DB, MERGE_DOCUMENT_IDS_FROM_TEAMS_DB, ADMIN_TEAMS_SAVE_CHANGES } from '../actions/types';
import { TEAMS_DEFAULT } from '../../utilities/constants';

const initialState = TEAMS_DEFAULT;

export default function adminTeamsReducer(state = initialState, action) {
    switch (action.type) {

        case LOAD_FROM_TEAMS_DB :
        case MERGE_DOCUMENT_IDS_FROM_TEAMS_DB :
        case ADMIN_TEAMS_SAVE_CHANGES :
            return [...action.data];

        default:
            return state;
    }
}