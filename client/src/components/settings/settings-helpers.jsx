import { SEASON, COMPETITION_START_DATE, FIXTURE_UPDATE_INTERVAL, BASE_FOR_RANDOM_MULTIPLIER, AWAY_TEAM_FACTOR, IS_NOT_A_TOP_TEAM_FACTOR, GOALS_PER_MINUTE_FACTOR, IS_IT_A_GOAL_FACTOR, IS_IT_A_GOAL_PENALTY_FACTOR, DIVISION_FACTOR } from '../../utilities/constants';
import * as helpers from '../../utilities/helper-functions/helpers';


export const getSettingsFactors = (values, isGoalFactorsANestedArray, returnGoalFactorsAsANestedArray, returnTypeForGoalsPerMinuteFactor) => {
    let settingsFactors;
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
        [IS_IT_A_GOAL_PENALTY_FACTOR]: parseFloat(goalFactorValues[IS_IT_A_GOAL_PENALTY_FACTOR].toString().trim()),
        [GOALS_PER_MINUTE_FACTOR]: goalsPerMinuteFactor,
    };

    settingsFactors = {
        [SEASON]: values[SEASON].trim(),
        [COMPETITION_START_DATE]: values[COMPETITION_START_DATE].trim(),
    };

    if (returnGoalFactorsAsANestedArray) {
        settingsFactors.goalFactors = goalFactors;
    } else {
        settingsFactors = { ...settingsFactors, ...goalFactors};
    }

    return settingsFactors;
}

export const validateSettingsFactors = (state) => {
    const validationErrors = helpers.deepClone(state.settingsFactorsValidationErrors);
    checkSettingsFactorsValidationErrors(state, validationErrors, [SEASON], key => key === "", "Please enter (in YYYY/YY format)");
    checkSettingsFactorsValidationErrors(state, validationErrors, [COMPETITION_START_DATE], key => key === "", "Please enter (in DD mmm YYYY format)");
    checkSettingsFactorsValidationErrors(state, validationErrors, [FIXTURE_UPDATE_INTERVAL], key => isNaN(key) || key <= 0, "Please enter a number greater than 0 (e.g. 0.5)");
    checkSettingsFactorsValidationErrors(state, validationErrors, [BASE_FOR_RANDOM_MULTIPLIER], key => isNaN(key) || key < 50 || key > 150, "Please enter an integer between 50 and 150 (e.g. 90)");
    checkSettingsFactorsValidationErrors(state, validationErrors, [AWAY_TEAM_FACTOR], key => isNaN(key) || key < 0.5 || key > 2, "Please enter a number between 0.5 and 2 (e.g. 1.25)");
    checkSettingsFactorsValidationErrors(state, validationErrors, [IS_NOT_A_TOP_TEAM_FACTOR], key => isNaN(key) || key < 1 || key > 2, "Please enter a number between 1 and 2 (e.g. 1.25)");
    checkSettingsFactorsValidationErrors(state, validationErrors, [DIVISION_FACTOR], key => isNaN(key) || key < 1 || key > 2, "Please enter a number between 1 and 2 (e.g. 1.25)");
    checkSettingsFactorsValidationErrors(state, validationErrors, [GOALS_PER_MINUTE_FACTOR], key => key === "", "Please enter an array of objects");
    checkSettingsFactorsValidationErrors(state, validationErrors, [IS_IT_A_GOAL_FACTOR], key => isNaN(key) || key < 1 || key > 5, "Please enter an integer between 1 and 5 inclusive (e.g. 2)");
    checkSettingsFactorsValidationErrors(state, validationErrors, [IS_IT_A_GOAL_PENALTY_FACTOR], key => isNaN(key) || key < 50 || key > 100, "Please enter an integer between 50 and 100 inclusive (e.g. 80)");
    return validationErrors;
}

const checkSettingsFactorsValidationErrors = (state, validationErrors, objectKey, comparison, message) => {
    validationErrors[objectKey] = (comparison(state[objectKey[0]]) ? message : '');
}

export const areThereSettingsFactorsValidationErrors = (settingsFactorsValidationErrors) => {
    let anyValidationErrors = false;
    Object.entries(settingsFactorsValidationErrors).forEach(([key, val]) => {
        if (val !== "") anyValidationErrors = true;
    });
    return anyValidationErrors; 
}

export const validateTeams = (state) => {
    const validationErrors = helpers.deepClone(state.teamsValidationErrors);
    for (let i = 0; i < state.teams.length; i++) {
        const divisionKey = helpers.getObjectKey(state.teams[i]);
        for (let j = 0; j < state.teams[i][divisionKey].length; j++) {
            if (state.teams[i][divisionKey][j].teamName === "") {
                validationErrors[i][divisionKey][j].errors = 'Please enter a team name';
            }
        }
    }
    return validationErrors;
}

export const areThereTeamsValidationErrors = (teamsValidationErrors) => {
    for (let i = 0; i < teamsValidationErrors.length; i++) {
        const divisionKey = helpers.getObjectKey(teamsValidationErrors[i]);
        for (let j = 0; j < teamsValidationErrors[i][divisionKey].length; j++) {
            if (teamsValidationErrors[i][divisionKey][j].errors !== "") {
                return true;
            }
        }
    }
    return false;
}

export const blankTeamsValidationError = (teamsValidationErrors, divisionIndex, teamIndex) => {
    return getNewTeamsArray(teamsValidationErrors, divisionIndex, teamIndex, "errors", '');
}

export const getTeamsValidationError = (teamsValidationErrors, divisionIndex, teamIndex) => {
    const divisionKey = helpers.getObjectKey(teamsValidationErrors[divisionIndex]);
    return teamsValidationErrors[divisionIndex][divisionKey][teamIndex].errors;
}

// const areAllValuesEnteredInTeams = (teams) => {
//     for (let i = 0; i < teams.length; i++) {
//         const divisionKey = helpers.getObjectKey(teams[i]);
//         for (let j = 0; j < teams[i][divisionKey].length; j++) {
//             if (teams[i][divisionKey][j].teamName.trim() === "") {
//                 return false;
//             }
//         }
//     }
//     return true;
// }

export const areThereAnyChangesToTeamValues = (originalValues, updatedValues) => {
    for (let i = 0; i < originalValues.length; i++) {
        const divisionKey = helpers.getObjectKey(originalValues[i]);
        for (let j = 0; j < originalValues[i][divisionKey].length; j++) {
            const originalValuesTeam = originalValues[i][divisionKey][j];
            const updatedValuesTeam = updatedValues[i][divisionKey][j];
            if (originalValuesTeam.teamName !== updatedValuesTeam.teamName || originalValuesTeam.isATopTeam !== updatedValuesTeam.isATopTeam) {
                return true;
            }
        }
    }
    return false;
}

export const areThereAnyChangesToMyWatchlistTeamValues = (originalValues, updatedValues) => {
    if (originalValues.length !== updatedValues.length) return true;
    for (let i = 0; i < originalValues.length; i++) {
        if (originalValues[i].teamName !== updatedValues[i].teamName) {
            return true;
        }
    }
    return false;
}

export const haveTeamValuesChanged = (originalValues, updatedValues) => {
    for (let i = 0; i < originalValues.length; i++) {
        if (originalValues[i].teamName !== updatedValues[i].teamName || originalValues[i].isATopTeam !== updatedValues[i].isATopTeam) return true;
    }
    return false;
}

export const haveSettingsFactorsValuesChanged = (originalValues, updatedValues) => {
    let anyChanges = false;
    Object.entries(originalValues).forEach(([key, val]) => {
        if (val !== updatedValues[key]) anyChanges = true;
    });
    return anyChanges;
};

export const haveValidationErrorValuesChanged = (originalValues, updatedValues) => {
    for (let i = 0; i < originalValues.length; i++) {
        if (originalValues[i].errors !== updatedValues[i].errors) return true;
    }
    return false;
}

export const areThereAnyChangesToSettingsFactorsValues = (originalValues, updatedValues, nestedObject = '') => {
    let anyChanges = false;
    Object.entries(updatedValues).forEach(([key, val]) => {
        if (val && typeof val === 'object') {
            areThereAnyChangesToSettingsFactorsValues(val, originalValues, key);  // recurse.
        } else {
            let oldValue = (nestedObject !== '' ? originalValues[nestedObject][key] : originalValues[key]);
            if (val !== oldValue) {
                anyChanges = true;
            }
        }
    });
    return anyChanges;
};

export const getUpdatesToTeamsToSendToDb = (originalValues, updatedValues) => {
    let updatedTeams = [];
    updatedValues.forEach((division, divisionIndex) => {
        const divisionKey = helpers.getObjectKey(division);
        division[divisionKey].forEach((team, teamIndex) => {
            const originalValuesObject = originalValues[divisionIndex][divisionKey][teamIndex];
            if (team.teamName !== originalValuesObject.teamName || team.isATopTeam !== originalValuesObject.isATopTeam) {
                updatedTeams.push(team);
            }
        });
    });
    return updatedTeams;
}

export const getNewMyWatchlistTeamsToSendToDb = (originalValues, updatedValues) => {
    let newTeams = [];
    if (updatedValues.length > originalValues.length) {
        for (let i = originalValues.length; i < updatedValues.length; i++) {
            if (updatedValues[i].teamName !== "") {
                newTeams.push(updatedValues[i]);
            }
        }
    }
    return newTeams;
}

export const removeBlanksFromMyWatchlistTeams = (teams) => {
    let newTeams = [];
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].teamName !== "") {
            newTeams.push(teams[i]);
        }
    }
    return newTeams;
}

export const getUpdatesToMyWatchlistTeamsToSendToDb = (originalValues, updatedValues) => {
    let updatedTeams = [];
    if (updatedValues.length === originalValues.length) {
        updatedValues.forEach((team, i) => {
            if (team.teamName !== originalValues[i].teamName) {
                updatedTeams.push(team);
            }
        });
    }
    return updatedTeams;
}

export const getDeletedMyWatchlistTeamsToSendToDb = (originalValues, updatedValues) => {
    let deletedTeams = [];
    if (updatedValues.length < originalValues.length) {
        for (let i = updatedValues.length; i < originalValues.length; i++) {
            deletedTeams.push(originalValues[i - 1]);
        }
    }
    return deletedTeams;
}

export const getUpdatesToSettingsFactorsToSendToDb = (originalValues, updatedValues) => {
    let updatedSettingsFactors = {};

    addToObjectIfChanged(updatedSettingsFactors, updatedValues, originalValues, SEASON);
    addToObjectIfChanged(updatedSettingsFactors, updatedValues, originalValues, COMPETITION_START_DATE);

    return updatedSettingsFactors;
}

export const getUpdatesToGoalFactorsToSendToDb = (originalValues, updatedValues) => {
    let updatedGoalFactors = {};

    addToObjectIfChanged(updatedGoalFactors, updatedValues.goalFactors, originalValues, FIXTURE_UPDATE_INTERVAL);
    addToObjectIfChanged(updatedGoalFactors, updatedValues.goalFactors, originalValues, BASE_FOR_RANDOM_MULTIPLIER);
    addToObjectIfChanged(updatedGoalFactors, updatedValues.goalFactors, originalValues, AWAY_TEAM_FACTOR);
    addToObjectIfChanged(updatedGoalFactors, updatedValues.goalFactors, originalValues, IS_NOT_A_TOP_TEAM_FACTOR);
    addToObjectIfChanged(updatedGoalFactors, updatedValues.goalFactors, originalValues, DIVISION_FACTOR);
    addToObjectIfChanged(updatedGoalFactors, updatedValues.goalFactors, originalValues, IS_IT_A_GOAL_FACTOR);
    addToObjectIfChanged(updatedGoalFactors, updatedValues.goalFactors, originalValues, GOALS_PER_MINUTE_FACTOR);

    return updatedGoalFactors;
}

const addToObjectIfChanged = (updatedFactors, updatedValues, originalValues, key) => {
    if (updatedValues[key] !== originalValues[key]) updatedFactors[key] = updatedValues[key];
}

export const getNewTeamsArray = (existingTeamsArray, divisionIndex, teamIndex, key, updatedValue) => {
    const divisionArray = existingTeamsArray[divisionIndex];
    const objectKey = helpers.getObjectKey(divisionArray);
    const preceedingTeams = divisionArray[objectKey].slice(0, teamIndex);
    const updatedTeam = {...divisionArray[objectKey][teamIndex], [key]: updatedValue};
    const succeedingTeams = divisionArray[objectKey].slice(teamIndex + 1);
    const newDivisionArray = { [objectKey]: preceedingTeams.concat(updatedTeam).concat(succeedingTeams) };

    return [...existingTeamsArray.slice(0, divisionIndex), newDivisionArray, ...existingTeamsArray.slice(divisionIndex + 1)];
};

export const getNewMyWatchlistTeamsArray = (existingTeamsArray, teamIndex, updatedValue) => {
    debugger;
    return [...existingTeamsArray.slice(0, teamIndex), { ...existingTeamsArray[teamIndex], teamName: updatedValue }, ...existingTeamsArray.slice(teamIndex + 1)];
};

export const deleteTeamFromMyWatchlistTeamsArray = (existingTeamsArray, teamIndex) => {
    return [...existingTeamsArray.slice(0, teamIndex === 0 ? 0 : teamIndex), ...existingTeamsArray.slice(teamIndex + 1)];
};
