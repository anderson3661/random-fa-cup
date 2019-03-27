import { combineReducers } from 'redux';

import userReducer from './userReducer';
import miscellaneousReducer from './miscellaneousReducer';
import settingsFactorsReducer from './settingsFactorsReducer';
import settingsTeamsReducer from './settingsTeamsReducer';
import settingsMyWatchlistTeamsReducer from './settingsMyWatchlistTeamsReducer';
import fixturesReducer from './fixturesReducer';

export default combineReducers({
    user: userReducer,
    miscellaneous: miscellaneousReducer,
    settingsFactors: settingsFactorsReducer,
    teamsForCompetition: settingsTeamsReducer,
    myWatchlistTeams: settingsMyWatchlistTeamsReducer,
    fixturesForCompetition: fixturesReducer,
});
