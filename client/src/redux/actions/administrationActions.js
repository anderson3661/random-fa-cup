import { LOADING_BACKEND_UPDATE, ADMIN_TEAMS_SAVE_CHANGES, ADMIN_FACTORS_SAVE_CHANGES, RESET_STATE_TO_DEFAULTS, UPDATE_MISCELLANEOUS_PROPERTY, MERGE_DOCUMENT_IDS_FROM_FIXTURES_DB, USER_AUTHENTICATED } from './types';
import { deleteAllDocumentsInDbs, createFixturesDocumentsInDb, updateTeamsDocumentsInDb, updateAdminFactorsDocumentInDb, updateMiscellaneousDocumentInDb, mergeDocumentsIdsFromFixturesDatabaseToObjectsInArray } from '../../utilities/data-backend';
import { createDocumentsInDbsFromAppDefaults } from './miscellaneousActions';
import * as helpers from '../../utilities/helper-functions/helpers';
import { createFixtures as helperCreateFixtures } from '../../utilities/helper-functions/create-fixtures';
import { SEASON_START_DATE, NUMBER_OF_FIXTURES_FOR_SEASON } from '../../utilities/constants';

// ACTION CREATORS

export const adminSaveChanges = (updatedTeams, updatedAdminFactors, data) => async (dispatch, getState) => {
    try {
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingAdmin: true }});
        if (updatedTeams.length > 0) {
            await updateTeamsDocumentsInDb(updatedTeams);
            dispatch({ type: ADMIN_TEAMS_SAVE_CHANGES, data: data.teams });
        }
        if (helpers.doesObjectHaveAnyProperties(updatedAdminFactors)) {
            await updateAdminFactorsDocumentInDb(getState().default.adminFactors._id, updatedAdminFactors);
            dispatch({ type: ADMIN_FACTORS_SAVE_CHANGES, data: data.adminFactors });
        }
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingAdmin: false }});
    } catch(error) {
        console.log('Error from adminSaveChanges', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingAdmin: false, loadingBackendError: true }});
    }
}

export const adminCreateSeasonsFixtures = () => async (dispatch, getState) => {
    try {
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingAdmin: true }});
        const data = { haveSeasonsFixturesBeenCreated: true };
        await updateMiscellaneousDocumentInDb(getState().default.miscellaneous._id, data);
        dispatch({ type: UPDATE_MISCELLANEOUS_PROPERTY, data });
        const fixturesForSeason = helperCreateFixtures(getState().default.teamsForSeason, getState().default.adminFactors[SEASON_START_DATE], getState().default.adminFactors[NUMBER_OF_FIXTURES_FOR_SEASON]);
        const results = await createFixturesDocumentsInDb(fixturesForSeason, getState().default.user._id);
        const updatedData = mergeDocumentsIdsFromFixturesDatabaseToObjectsInArray(fixturesForSeason, results);
        dispatch({ type: MERGE_DOCUMENT_IDS_FROM_FIXTURES_DB, data: updatedData });
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingAdmin: false }});
    } catch(error) {
        console.log('Error from adminCreateSeasonsFixtures', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingAdmin: false, loadingBackendError: true }});
    }
}

export const adminResetApp = () => async (dispatch, getState) => {
    try {
        const userDetails = getState().default.user;                                // RESET_STATE_TO_DEFAULTS will set authenticated user details back to default values, so get a handle to the current values
        dispatch({ type: RESET_STATE_TO_DEFAULTS });                                // RESET_STATE_TO_DEFAULTS is used in store.js to set the state back to default values ... needs to be first otherwise loadAdmin is overwritten
        dispatch({ type: USER_AUTHENTICATED, data: userDetails });                  // Now set the authenticated user details back to the stored values above
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingAdmin: true }});
        const documentIdInUsersDb = getState().default.user._id;
        await deleteAllDocumentsInDbs(documentIdInUsersDb);
        dispatch(createDocumentsInDbsFromAppDefaults(documentIdInUsersDb));
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingAdmin: false }});
    } catch(error) {
        console.log('Error from adminResetApp', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingAdmin: false, loadingBackendError: true }});
    }
}
