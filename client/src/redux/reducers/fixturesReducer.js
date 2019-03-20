import { LOAD_FROM_FIXTURES_DB, UPDATE_FIXTURES_IN_STORE } from '../actions/types';
import { FIXTURES_DEFAULT, COMPETITION_ROUNDS, COMPETITION_ROUNDS_FIXTURES } from '../../utilities/constants';

const initialState = FIXTURES_DEFAULT;


export default function fixturesReducer(state = initialState, action) {
    let newState;
    let isReplays;
    let arrayToUpdate;
    let indexFixtures;
    switch (action.type) {

        case LOAD_FROM_FIXTURES_DB :
            if (action.data.length > 0) {
                return [...action.data];
            }
            return state;

        case UPDATE_FIXTURES_IN_STORE :
            debugger;
            isReplays = action.data.fixtures[0].isReplay;
            arrayToUpdate = isReplays ? 'Replays' : 'Fixtures';
            indexFixtures = COMPETITION_ROUNDS.indexOf(action.data.fixtures[0].competitionRound);

            newState = (indexFixtures === 0) ?
            [Object.assign({}, ...state.slice(0, 1), {[COMPETITION_ROUNDS_FIXTURES[indexFixtures] + arrayToUpdate]: action.data.fixtures})].concat([...state.slice(1)]) :
            [...state.slice(0, indexFixtures), Object.assign({}, ...state.slice(indexFixtures, indexFixtures + 1), {[COMPETITION_ROUNDS_FIXTURES[indexFixtures] + arrayToUpdate]: action.data.fixtures}), ...state.slice(indexFixtures + 1)];

            return [...newState];

        default:
            return state;

    }
}