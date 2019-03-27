import { LOADING_BACKEND_UPDATE, SETTINGS_TEAMS_SAVE_CHANGES, SETTINGS_MY_WATCHLIST_TEAMS_SAVE_CHANGES, SETTINGS_FACTORS_SAVE_CHANGES, ADD_MY_WATCHLIST_TEAMS_IN_STORE, RESET_STATE_TO_DEFAULTS } from './types';
import { deleteAllDocumentsInDbs, createMyWatchlistTeamsDocumentsInDb, updateTeamsDocumentsInDb, updateMyWatchlistTeamsDocumentsInDb, deleteMyWatchlistTeamsDocumentsInDb, updateSettingsFactorsDocumentInDb, mergeDocumentsIdsFromDatabaseToObjectsInArray } from '../../utilities/data-backend';
import { createDocumentsInDbsFromAppDefaults } from './miscellaneousActions';
import * as helpers from '../../utilities/helper-functions/helpers';
// import { createFixtures as helperCreateFixtures } from '../../utilities/helper-functions/create-fixtures';
// import { COMPETITION_START_DATE } from '../../utilities/constants';

// ACTION CREATORS

export const settingsSaveChanges = (updatedTeams, newMyWatchlistTeams, updatedMyWatchlistTeams, deletedMyWatchlistTeams, updatedSettingsFactors, data) => async (dispatch, getState) => {
    try {
        let actionPerformed = false;
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingSettings: true }});
        if (updatedTeams.length > 0) {
            await updateTeamsDocumentsInDb(updatedTeams);
            dispatch({ type: SETTINGS_TEAMS_SAVE_CHANGES, data: data.teams });
            actionPerformed = true;
        }

        if (newMyWatchlistTeams.length > 0) {
            const results = await createMyWatchlistTeamsDocumentsInDb(newMyWatchlistTeams, getState().default.user._id);
            const updatedData = mergeDocumentsIdsFromDatabaseToObjectsInArray(newMyWatchlistTeams, results);
            dispatch({ type: ADD_MY_WATCHLIST_TEAMS_IN_STORE, data: {myWatchlistTeams: updatedData }});
            actionPerformed = true;
        }

        if (updatedMyWatchlistTeams.length > 0) {
            await updateMyWatchlistTeamsDocumentsInDb(updatedMyWatchlistTeams);
            dispatch({ type: SETTINGS_MY_WATCHLIST_TEAMS_SAVE_CHANGES, data: data.myWatchlistTeams });
            actionPerformed = true;
        }

        if (deletedMyWatchlistTeams.length > 0) {
            await deleteMyWatchlistTeamsDocumentsInDb(deletedMyWatchlistTeams);
            dispatch({ type: SETTINGS_MY_WATCHLIST_TEAMS_SAVE_CHANGES, data: data.myWatchlistTeams });
            actionPerformed = true;
        }

        if (helpers.doesObjectHaveAnyProperties(updatedSettingsFactors)) {
            await updateSettingsFactorsDocumentInDb(getState().default.settingsFactors._id, updatedSettingsFactors);
            dispatch({ type: SETTINGS_FACTORS_SAVE_CHANGES, data: data.settingsFactors });
            actionPerformed = true;
        }

        // If saving changes, and none of the actions above are needed, then need to add a timeout so that the 'Changes Saved' dialog appears
        // Otherwise the loadingSettings: false is batched at the same time as loadingSettings: true, and therefore loadingSettings: true never happens
        if (!actionPerformed) await setTimeout(() => {}, 500);

        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingSettings: false }});
    } catch(error) {
        console.log('Error from settingsSaveChanges', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingSettings: false, loadingBackendError: true }});
    }
}

export const settingsResetApp = () => async (dispatch, getState) => {
    try {
        dispatch({ type: RESET_STATE_TO_DEFAULTS });                                // RESET_STATE_TO_DEFAULTS is used in store.js to set the state back to default values
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingSettings: true }});
        const documentIdInUsersDb = getState().default.user._id;
        await deleteAllDocumentsInDbs(documentIdInUsersDb);
        dispatch(createDocumentsInDbsFromAppDefaults(documentIdInUsersDb));
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingSettings: false }});
    } catch(error) {
        console.log('Error from settingsResetApp', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingSettings: false, loadingBackendError: true }});
    }
}

// export const settingsCreateFixtures = () => async (dispatch, getState) => {
//     try {
//         dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingSettings: true }});
//         const data = { haveRound1FixturesBeenCreated: true };
//         await updateMiscellaneousDocumentInDb(getState().default.miscellaneous._id, data);
//         dispatch({ type: UPDATE_MISCELLANEOUS_PROPERTY, data });
//         const fixturesForCompetition = helperCreateFixtures(getState().default.teamsForCompetition, getState().default.settingsFactors[COMPETITION_START_DATE]);
//         const results = await createFixturesDocumentsInDb(fixturesForCompetition, getState().default.user._id);
//         const updatedData = mergeDocumentsIdsFromFixturesDatabaseToObjectsInArray(fixturesForCompetition, results);
//         dispatch({ type: UPDATE_FIXTURES_IN_STORE, data: {fixtures: updatedData }});
//         dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingSettings: false }});
//     } catch(error) {
//         console.log('Error from settingsCreateFixtures', error);
//         dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingSettings: false, loadingBackendError: true }});
//     }
// }
