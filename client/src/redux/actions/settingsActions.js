import { LOADING_BACKEND_UPDATE, SETTINGS_TEAMS_SAVE_CHANGES, SETTINGS_MY_WATCHLIST_TEAMS_SAVE_CHANGES, SETTINGS_FACTORS_SAVE_CHANGES, ADD_MY_WATCHLIST_TEAMS_IN_STORE, RESET_STATE_TO_DEFAULTS, RESET_STATE_KEEP_CURRENT_SETTINGS, LOAD_FROM_MISCELLANEOUS_DB } from './types';
import { API_ENDPOINT_MISCELLANEOUS } from '../../utilities/constants';
import { deleteAllDocumentsInDbs, deleteAllDocumentsInDbsKeepCurrentSettings, createDocumentInASingleDocumentDb, createMyWatchlistTeamsDocumentsInDb, updateTeamsDocumentsInDb, updateMyWatchlistTeamsDocumentsInDb, deleteMyWatchlistTeamsDocumentsInDb, updateSettingsFactorsDocumentInDb, mergeDocumentsIdsFromDatabaseToObjectsInArray } from '../../utilities/data-backend';
import { createDocumentsInDbsFromAppDefaults } from './miscellaneousActions';
import * as helpers from '../../utilities/helper-functions/helpers';

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

export const settingsResetAppKeepCurrentSettings = () => async (dispatch, getState) => {
    // This keeps Settings (Factors and Teams), but deletes Miscellaneous and Fixtures
    let results;
    try {
        dispatch({ type: RESET_STATE_KEEP_CURRENT_SETTINGS });                                // RESET_STATE_KEEP_CURRENT_SETTINGS is used in store.js to set SOME state back to default values
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingSettings: true }});
        const documentIdInUsersDb = getState().default.user._id;

        await deleteAllDocumentsInDbsKeepCurrentSettings(documentIdInUsersDb);

        results = await createDocumentInASingleDocumentDb(getState().default.miscellaneous, API_ENDPOINT_MISCELLANEOUS, 'Miscellaneous', documentIdInUsersDb);
        dispatch({ type: LOAD_FROM_MISCELLANEOUS_DB, data: results });            // The API call returns an object so update the store

        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingSettings: false }});
    } catch(error) {
        console.log('Error from settingsResetAppKeepCurrentSettings', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingSettings: false, loadingBackendError: true }});
    }
}
