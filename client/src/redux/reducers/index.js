import { combineReducers } from 'redux';

import userReducer from './userReducer';
import miscellaneousReducer from './miscellaneousReducer';
import adminFactorsReducer from './adminFactorsReducer';
import adminTeamsReducer from './adminTeamsReducer';
import adminMyWatchlistTeamsReducer from './adminMyWatchlistTeamsReducer';
import fixturesReducer from './fixturesReducer';

export default combineReducers({
    user: userReducer,
    miscellaneous: miscellaneousReducer,
    adminFactors: adminFactorsReducer,
    teamsForCompetition: adminTeamsReducer,
    myWatchlistTeams: adminMyWatchlistTeamsReducer,
    fixturesForCompetition: fixturesReducer,
});
