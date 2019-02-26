import { SEASON, SEASON_START_DATE, NUMBER_OF_FIXTURES_FOR_SEASON, FIXTURE_UPDATE_INTERVAL, BASE_FOR_RANDOM_MULTIPLIER, AWAY_TEAM_FACTOR, IS_NOT_A_TOP_TEAM_FACTOR, GOALS_PER_MINUTE_FACTOR, IS_IT_A_GOAL_FACTOR } from '../../utilities/constants';

export const validateAdmin = (state) => {
    let validationWarnings = "";

    if (!areAllArrayValuesEntered(state.teams, "teamName")) {
        validationWarnings += `\n- All Teams must be entered`;
    }

    if (state[SEASON] === "") {
        validationWarnings += `\n- 'Season' must be entered in NNNN/NN format`;
    }

    if (state[SEASON_START_DATE] === "") {
        validationWarnings += `\n- 'Season Start Date' must be entered in DD mmm YYYY format`;
    }

    if (isNaN(state[NUMBER_OF_FIXTURES_FOR_SEASON]) || state[NUMBER_OF_FIXTURES_FOR_SEASON] < 1 || state[NUMBER_OF_FIXTURES_FOR_SEASON] > 30) {
        validationWarnings += `\n- 'Number of Fixtures for Season' must be a valid number between 1 and 30 (30 is currently the upper limit due to fixture scheduling issues)`;
    }

    if (isNaN(state[FIXTURE_UPDATE_INTERVAL]) || state[FIXTURE_UPDATE_INTERVAL] <= 0) {
        validationWarnings += `\n- 'Fixture Update Interval (seconds)' must be a valid number, greater than 0`;
    }

    if (isNaN(state[BASE_FOR_RANDOM_MULTIPLIER]) || state[BASE_FOR_RANDOM_MULTIPLIER] < 50 || state[BASE_FOR_RANDOM_MULTIPLIER] > 150) {
        validationWarnings += `\n- 'Base For Random Multiplier' must be a valid number between 50 and 150`;
    }

    if (isNaN(state[AWAY_TEAM_FACTOR]) || state[AWAY_TEAM_FACTOR] < 0.5 || state[AWAY_TEAM_FACTOR] > 2) {
        validationWarnings += `\n- 'Away Team Factor' must be a valid number between 0.5 and 2`;
    }

    if (isNaN(state[IS_NOT_A_TOP_TEAM_FACTOR]) || state[IS_NOT_A_TOP_TEAM_FACTOR] < 1 || state[IS_NOT_A_TOP_TEAM_FACTOR] > 2) {
        validationWarnings += `\n- 'Is Not A Top Team Factor' must be a valid number between 1 and 2`;
    }

    if (state[GOALS_PER_MINUTE_FACTOR] === "") {
        validationWarnings += `\n- 'Goals Per Minute Factor' must be entered (as an array of objects)`;
    }

    if (isNaN(state[IS_IT_A_GOAL_FACTOR]) || state[IS_IT_A_GOAL_FACTOR] < 1 || state[IS_IT_A_GOAL_FACTOR] > 5) {
        validationWarnings += `\n- 'Is It A Goal Factor' must be a valid number between 1 and 5`;
    }

    if (validationWarnings) {
        alert(`Cannot continue ... please correct the following and retry ...\n\n` + validationWarnings);
    }

    return validationWarnings;
}

const areAllArrayValuesEntered = (arrayName, propertyName) => {
    let allValuesEntered = true;
    arrayName.forEach(value => {if (value[propertyName].trim() === "") allValuesEntered = false});
    return allValuesEntered;
}

export const areThereAnyChangesToTeamValues = (originalValues, updatedValues) => {
    for (let i = 0; i < originalValues.length; i++) {
        if (originalValues[i].teamName !== updatedValues[i].teamName || originalValues[i].isATopTeam !== updatedValues[i].isATopTeam) return true;
    }
    return false;
}

export const areThereAnyChangesToAdminFactorsValues = (updatedValues, originalValues, nestedObject = '') => {
    Object.entries(updatedValues).forEach(([key, val]) => {
        if (val && typeof val === 'object') {
            areThereAnyChangesToAdminFactorsValues(val, originalValues, key);  // recurse.
        } else {
            let oldValue = (nestedObject !== '' ? originalValues[nestedObject][key] : originalValues[key]);
            if (val !== oldValue) {
                return true;
            }
        }
    });
    return false;
};

export const getUpdatesToTeamsToSendToDb = (updatedValues, originalValues) => {
    let updatedTeams = [];
    updatedValues.forEach((team, i) => {
        if (team.teamName !== originalValues[i].teamName || team.isATopTeam !== originalValues[i].isATopTeam) {
            updatedTeams.push(team);
        }
    });
    return updatedTeams;
}

export const getUpdatesToAdminFactorsToSendToDb = (updatedValues, originalValues) => {
    let updatedAdminFactors = {};

    addToObjectIfChanged(updatedAdminFactors, updatedValues, originalValues, SEASON);
    addToObjectIfChanged(updatedAdminFactors, updatedValues, originalValues, SEASON_START_DATE);
    addToObjectIfChanged(updatedAdminFactors, updatedValues, originalValues, NUMBER_OF_FIXTURES_FOR_SEASON);

    return updatedAdminFactors;
}

export const getUpdatesToGoalFactorsToSendToDb = (updatedValues, originalValues) => {
    let updatedGoalFactors = {};

    addToObjectIfChanged(updatedGoalFactors, updatedValues.goalFactors, originalValues, FIXTURE_UPDATE_INTERVAL);
    addToObjectIfChanged(updatedGoalFactors, updatedValues.goalFactors, originalValues, BASE_FOR_RANDOM_MULTIPLIER);
    addToObjectIfChanged(updatedGoalFactors, updatedValues.goalFactors, originalValues, AWAY_TEAM_FACTOR);
    addToObjectIfChanged(updatedGoalFactors, updatedValues.goalFactors, originalValues, IS_NOT_A_TOP_TEAM_FACTOR);
    addToObjectIfChanged(updatedGoalFactors, updatedValues.goalFactors, originalValues, IS_IT_A_GOAL_FACTOR);
    addToObjectIfChanged(updatedGoalFactors, updatedValues.goalFactors, originalValues, GOALS_PER_MINUTE_FACTOR);

    return updatedGoalFactors;
}

const addToObjectIfChanged = (updatedFactors, updatedValues, originalValues, key) => {
    if (updatedValues[key] !== originalValues[key]) updatedFactors[key] = updatedValues[key];
}