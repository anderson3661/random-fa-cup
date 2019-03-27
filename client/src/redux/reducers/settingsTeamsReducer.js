import { LOAD_FROM_TEAMS_DB, MERGE_DOCUMENT_IDS_FROM_TEAMS_DB, SETTINGS_TEAMS_SAVE_CHANGES } from '../actions/types';
import { TEAMS_DEFAULT } from '../../utilities/constants';

import * as helpers from '../../utilities/helper-functions/helpers';

const initialState = helpers.deepClone(TEAMS_DEFAULT);

export default function settingsTeamsReducer(state = initialState, action) {
    switch (action.type) {

        case LOAD_FROM_TEAMS_DB :
        case MERGE_DOCUMENT_IDS_FROM_TEAMS_DB :
        case SETTINGS_TEAMS_SAVE_CHANGES :
            return [...action.data];

        default:
            return state;
    }
}