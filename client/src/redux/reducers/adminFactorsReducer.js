import { LOAD_FROM_ADMIN_FACTORS_DB, ADMIN_FACTORS_SAVE_CHANGES } from '../actions/types';
import { DEFAULT_VALUE_SEASON, DEFAULT_VALUE_SEASON_START_DATE, DEFAULT_VALUE_NUMBER_OF_FIXTURES_FOR_SEASON, DEFAULT_VALUE_FIXTURE_UPDATE_INTERVAL, DEFAULT_VALUE_BASE_FOR_RANDOM_MULTIPLIER, DEFAULT_VALUE_AWAY_TEAM_FACTOR, DEFAULT_VALUE_IS_NOT_A_TOP_TEAM_FACTOR, DEFAULT_VALUE_GOALS_PER_MINUTE_FACTOR, DEFAULT_VALUE_IS_IT_A_GOAL_FACTOR } from '../../utilities/constants';

const initialState = {
    season: DEFAULT_VALUE_SEASON,
    seasonStartDate: DEFAULT_VALUE_SEASON_START_DATE,
    numberOfFixturesForSeason: DEFAULT_VALUE_NUMBER_OF_FIXTURES_FOR_SEASON,
    goalFactors: {
        isAwayTeam: DEFAULT_VALUE_AWAY_TEAM_FACTOR,
        isNotATopTeam: DEFAULT_VALUE_IS_NOT_A_TOP_TEAM_FACTOR,
        baseForRandomMultiplier: DEFAULT_VALUE_BASE_FOR_RANDOM_MULTIPLIER,
        likelihoodOfAGoalDuringASetPeriod: DEFAULT_VALUE_GOALS_PER_MINUTE_FACTOR,
        isItAGoal: DEFAULT_VALUE_IS_IT_A_GOAL_FACTOR,
        fixtureUpdateInterval: DEFAULT_VALUE_FIXTURE_UPDATE_INTERVAL,
    },
    dataStorage: 'Browser',
}

export default function adminFactorsReducer(state = initialState, action) {
    let newState;
    switch (action.type) {

        case LOAD_FROM_ADMIN_FACTORS_DB :
            return Object.assign({}, state, action.data);

        case ADMIN_FACTORS_SAVE_CHANGES :
            debugger;
            newState = Object.assign({}, state);

            //Loop through the object, i.e. miscInfo
            Object.keys(action.data).forEach(e => {

                if (typeof(action.data[e]) === 'object') {
                    
                    //Loop through the sub-object, i.e. miscInfo.goalFactors
                    Object.keys(action.data.goalFactors).forEach(e => {
                        newState.goalFactors[e] = action.data.goalFactors[e];
                    })
                } else {
                    newState[e] = action.data[e];
                }
            });

            return newState;

        default:
            return state;
    }
}