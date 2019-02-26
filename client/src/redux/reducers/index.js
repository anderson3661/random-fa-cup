import { combineReducers } from 'redux';

import userReducer from './userReducer';
import miscellaneousReducer from './miscellaneousReducer';
import adminFactorsReducer from './adminFactorsReducer';
import adminTeamsReducer from './adminTeamsReducer';
import fixturesReducer from './fixturesReducer';
import leagueTableReducer from './leagueTableReducer';

export default combineReducers({
    user: userReducer,
    miscellaneous: miscellaneousReducer,
    adminFactors: adminFactorsReducer,
    teamsForSeason: adminTeamsReducer,
    fixturesForSeason: fixturesReducer,
    leagueTable: leagueTableReducer,
});
