import { LOAD_FROM_FIXTURES_DB, MERGE_DOCUMENT_IDS_FROM_FIXTURES_DB, UPDATE_FIXTURES_IN_STORE_AFTER_RESULTS } from '../actions/types';
import * as helpers from '../../utilities/helper-functions/helpers';

const initialState = {}

export default function fixturesReducer(state = initialState, action) {
    let newState;
    switch (action.type) {

        case LOAD_FROM_FIXTURES_DB :
        case MERGE_DOCUMENT_IDS_FROM_FIXTURES_DB :
            return [...action.data];

        case UPDATE_FIXTURES_IN_STORE_AFTER_RESULTS :
            const indexSetOfFixtures = helpers.getPositionInArrayOfObjects(state, "dateOfSetOfFixtures", action.data.dateOfLastSetOfFixtures);

            newState = (indexSetOfFixtures === 0) ?
            [{fixtures: action.data.latestFixtures, dateOfSetOfFixtures: action.data.dateOfLastSetOfFixtures}, ...state.slice(1)] :
            [...state.slice(0, indexSetOfFixtures), {fixtures: action.data.latestFixtures, dateOfSetOfFixtures: action.data.dateOfLastSetOfFixtures}, ...state.slice(indexSetOfFixtures + 1)];

            return [...newState];

        default:
            return state;

        // case LATEST_FIXTURES_SEASON_HAS_FINISHED :
        //     // console.log('state: ', state);
        //     // console.log('action.data: ', action.data);
        //     newState = Object.assign({}, state, {
        //         appData: {
        //             miscInfo: Object.assign({}, state.appData.miscInfo, { hasSeasonFinished: action.data.hasSeasonFinished }),
        //             setsOfFixtures: [...state.appData.setsOfFixtures],
        //             latestTable: [...state.appData.latestTable],
        //             teamsForSeason: [...state.appData.teamsForSeason]
        //         }
        //     });
        //     // console.log('newState: ', newState);

        //     return newState;

    }
}