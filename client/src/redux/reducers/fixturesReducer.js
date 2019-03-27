import { LOAD_FROM_FIXTURES_DB, UPDATE_FIXTURES_IN_STORE } from '../actions/types';
import { FIXTURES_DEFAULT, COMPETITION_ROUNDS, COMPETITION_ROUNDS_FIXTURES } from '../../utilities/constants';

import * as helpers from '../../utilities/helper-functions/helpers';

const initialState = helpers.deepClone(FIXTURES_DEFAULT);


export default function fixturesReducer(state = initialState, action) {
    switch (action.type) {

        case LOAD_FROM_FIXTURES_DB :
            debugger;
            if (action.data.length > 0) {
                return [...action.data];
            }
            return state;

        case UPDATE_FIXTURES_IN_STORE :
            debugger;
            const isReplays = action.data.fixtures[0].isReplay;           // At the start of the competition this will be undefined, but doesn't matter as next line caters for that
            const arrayToUpdate = isReplays ? 'Replays' : 'Fixtures';
            const indexFixtures = Math.max(0, COMPETITION_ROUNDS.indexOf(action.data.fixtures[0].competitionRound));   // At the start of the competition this will be -1 as competition round is undefined
            
            const objectKeyToUpdate = COMPETITION_ROUNDS_FIXTURES[indexFixtures] + arrayToUpdate;
            const updatedArrayElement = Object.assign({}, ...state.slice(indexFixtures, indexFixtures + 1), {[objectKeyToUpdate]: action.data.fixtures});
            
            const newState = [...state.slice(0, indexFixtures)].concat(updatedArrayElement).concat([...state.slice(indexFixtures + 1)]);

            return newState;

        default:
            return state;

    }
}