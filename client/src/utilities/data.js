import { SEASON, COMPETITION_START_DATE, FIXTURE_UPDATE_INTERVAL, BASE_FOR_RANDOM_MULTIPLIER, AWAY_TEAM_FACTOR, IS_NOT_A_TOP_TEAM_FACTOR, DIVISION_FACTOR, GOALS_PER_MINUTE_FACTOR, IS_IT_A_GOAL_FACTOR } from './constants';
import * as helpers from './helper-functions/helpers';

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
        [DIVISION_FACTOR]: parseFloat(goalFactorValues[DIVISION_FACTOR].toString().trim()),
        [IS_IT_A_GOAL_FACTOR]: parseFloat(goalFactorValues[IS_IT_A_GOAL_FACTOR].toString().trim()),
        [GOALS_PER_MINUTE_FACTOR]: goalsPerMinuteFactor,
    };

    adminFactors = {
        [SEASON]: values[SEASON].trim(),
        [COMPETITION_START_DATE]: values[COMPETITION_START_DATE].trim(),
    };

    if (returnGoalFactorsAsANestedArray) {
        adminFactors.goalFactors = goalFactors;
    } else {
        adminFactors = { ...adminFactors, ...goalFactors};
    }

    return adminFactors;
}
