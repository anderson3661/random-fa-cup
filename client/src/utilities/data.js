import { SEASON, SEASON_START_DATE, NUMBER_OF_FIXTURES_FOR_SEASON, FIXTURE_UPDATE_INTERVAL, BASE_FOR_RANDOM_MULTIPLIER, AWAY_TEAM_FACTOR, IS_NOT_A_TOP_TEAM_FACTOR, GOALS_PER_MINUTE_FACTOR, IS_IT_A_GOAL_FACTOR } from './constants';
import * as helpers from './helper-functions/helpers';

export const createLeagueTable = (teamsForSeason) => {
    //Populate the league table array with blank values
    let leagueTable = [];
    teamsForSeason.forEach(team => leagueTable.push(getZerosiedTeamInLeagueTable(team.teamName)));
    return leagueTable;
}

export const getZerosiedTeamInLeagueTable = teamName => {
    return {
        teamName: teamName,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0,
        form: [],
        homeWon: 0,
        homeDrawn: 0,
        homeLost: 0,
        homeGoalsFor: 0,
        homeGoalsAgainst: 0,
        awayWon: 0,
        awayDrawn: 0,
        awayLost: 0,
        awayGoalsFor: 0,
        awayGoalsAgainst: 0,
    }
}

export const getAdminFactors = (values, isGoalFactorsANestedArray, returnGoalFactorsAsANestedArray, returnTypeForGoalsPerMinuteFactor) => {
    let adminFactors;
    let goalsPerMinuteFactor;
    let goalFactorValues;

    goalFactorValues = (isGoalFactorsANestedArray ? values.goalFactors : values);

    goalsPerMinuteFactor = helpers.getGoalsPerMinuteFactors(goalFactorValues[GOALS_PER_MINUTE_FACTOR], returnTypeForGoalsPerMinuteFactor);

    let goalFactors = {
        [FIXTURE_UPDATE_INTERVAL]: parseFloat(goalFactorValues[FIXTURE_UPDATE_INTERVAL].toString().trim()),
        [BASE_FOR_RANDOM_MULTIPLIER]: parseFloat(goalFactorValues[BASE_FOR_RANDOM_MULTIPLIER].toString().trim()),
        [AWAY_TEAM_FACTOR]: parseFloat(goalFactorValues[AWAY_TEAM_FACTOR].toString().trim()),
        [IS_NOT_A_TOP_TEAM_FACTOR]: parseFloat(goalFactorValues[IS_NOT_A_TOP_TEAM_FACTOR].toString().trim()),
        [IS_IT_A_GOAL_FACTOR]: parseFloat(goalFactorValues[IS_IT_A_GOAL_FACTOR].toString().trim()),
        [GOALS_PER_MINUTE_FACTOR]: goalsPerMinuteFactor,
    };

    adminFactors = {
        [SEASON]: values[SEASON].trim(),
        [SEASON_START_DATE]: values[SEASON_START_DATE].trim(),
        [NUMBER_OF_FIXTURES_FOR_SEASON]: parseInt(values[NUMBER_OF_FIXTURES_FOR_SEASON].toString().trim(), 10),
    };

    if (returnGoalFactorsAsANestedArray) {
        adminFactors.goalFactors = goalFactors;
    } else {
        adminFactors = { ...adminFactors, ...goalFactors};
    }

    return adminFactors;
}
