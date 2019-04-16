import { LOADING_BACKEND_UPDATE, SETTINGS_TEAMS_SAVE_CHANGES, SETTINGS_MY_WATCHLIST_TEAMS_SAVE_CHANGES, SETTINGS_FACTORS_SAVE_CHANGES, ADD_MY_WATCHLIST_TEAMS_IN_STORE, RESET_STATE_TO_DEFAULTS, RESET_STATE_KEEP_CURRENT_SETTINGS, LOAD_FROM_MISCELLANEOUS_DB } from './types';
import { API_ENDPOINT_MISCELLANEOUS } from '../../utilities/constants';
import { userValidateAndReturnUserDocId, deleteAllDocumentsInDbs, deleteAllDocumentsInDbsKeepCurrentSettings, createOrUpdateDocumentInASingleDocumentDb, createMyWatchlistTeamsDocumentsInDb, updateTeamsDocumentsInDb, updateMyWatchlistTeamsDocumentsInDb, deleteMyWatchlistTeamsDocumentsInDb, updateSettingsFactorsDocumentInDb, mergeDocumentsIdsFromDatabaseToObjectsInArray } from '../../utilities/data-backend';
import { createDocumentsInDbsFromAppDefaults } from './miscellaneousActions';
import * as helpers from '../../utilities/helper-functions/helpers';

// ACTION CREATORS

export const settingsSaveChanges = (updatedTeams, newMyWatchlistTeams, updatedMyWatchlistTeams, deletedMyWatchlistTeams, updatedSettingsFactors, data) => async (dispatch, getState) => {
    try {
        const userId = await userValidateAndReturnUserDocId();
        if (userId) {
            let actionPerformed = false;
            dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: true }});
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
            // Otherwise the loading: false is batched at the same time as loading: true, and therefore loading: true never happens
            if (!actionPerformed) await setTimeout(() => {}, 500);

            dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: false }});
        }
    } catch(error) {
        console.log('Error from settingsSaveChanges', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: false, loadingBackendError: true }});
    }
}

export const settingsResetApp = (userId, dispatchDisplayLoading=true) => async (dispatch) => {
    try {
        if (!userId) userId = await userValidateAndReturnUserDocId();                       // User Id is blank when called from Settings - Reset App, but has a value when called from Sign Up
        if (userId) {
            dispatch({ type: RESET_STATE_TO_DEFAULTS });                                    // RESET_STATE_TO_DEFAULTS is used in store.js to set the state back to default values
            dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: true }});             // This needs to be after RESET_STATE_TO_DEFAULTS otherwise loading gets set back to its default value.  It resets loading to true so there is a momentary pause in the loading indicator
            await deleteAllDocumentsInDbs(userId);
            await dispatch(createDocumentsInDbsFromAppDefaults(userId));
            if (dispatchDisplayLoading) dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: false }});
        }
    } catch(error) {
        console.log('Error from settingsResetApp', error);
        if (dispatchDisplayLoading) dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: false, loadingBackendError: true }});
    }
}

export const settingsResetAppKeepCurrentSettings = () => async (dispatch, getState) => {
    // This keeps Settings (Factors and Teams), but deletes Miscellaneous and Fixtures
    let results;
    try {
        const userId = await userValidateAndReturnUserDocId();
        if (userId) {
            dispatch({ type: RESET_STATE_KEEP_CURRENT_SETTINGS });                                // RESET_STATE_KEEP_CURRENT_SETTINGS is used in store.js to set SOME state back to default values
            dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: true }});

            await deleteAllDocumentsInDbsKeepCurrentSettings(userId);

            results = await createOrUpdateDocumentInASingleDocumentDb(getState().default.miscellaneous, API_ENDPOINT_MISCELLANEOUS, 'Miscellaneous', userId);
            dispatch({ type: LOAD_FROM_MISCELLANEOUS_DB, data: results });            // The API call returns an object so update the store

            dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: false }});
        }
    } catch(error) {
        console.log('Error from settingsResetAppKeepCurrentSettings', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: false, loadingBackendError: true }});
    }
}
