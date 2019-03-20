import { LOADING_BACKEND_UPDATE, ADMIN_TEAMS_SAVE_CHANGES, ADMIN_MY_WATCHLIST_TEAMS_SAVE_CHANGES, ADMIN_FACTORS_SAVE_CHANGES, ADD_MY_WATCHLIST_TEAMS_IN_STORE, RESET_STATE_TO_DEFAULTS, UPDATE_MISCELLANEOUS_PROPERTY, UPDATE_FIXTURES_IN_STORE, USER_AUTHENTICATION } from './types';
import { deleteAllDocumentsInDbs, createMyWatchlistTeamsDocumentsInDb, createFixturesDocumentsInDb, updateTeamsDocumentsInDb, updateMyWatchlistTeamsDocumentsInDb, deleteMyWatchlistTeamsDocumentsInDb, updateAdminFactorsDocumentInDb, updateMiscellaneousDocumentInDb, mergeDocumentsIdsFromDatabaseToObjectsInArray, mergeDocumentsIdsFromFixturesDatabaseToObjectsInArray } from '../../utilities/data-backend';
import { createDocumentsInDbsFromAppDefaults } from './miscellaneousActions';
import * as helpers from '../../utilities/helper-functions/helpers';
import { createFixtures as helperCreateFixtures } from '../../utilities/helper-functions/create-fixtures';
import { COMPETITION_START_DATE } from '../../utilities/constants';

// ACTION CREATORS

export const adminSaveChanges = (updatedTeams, newMyWatchlistTeams, updatedMyWatchlistTeams, deletedMyWatchlistTeams, updatedAdminFactors, data) => async (dispatch, getState) => {
    try {
        const actionPerformed = false;
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingAdmin: true }});
        if (updatedTeams.length > 0) {
            await updateTeamsDocumentsInDb(updatedTeams);
            dispatch({ type: ADMIN_TEAMS_SAVE_CHANGES, data: data.teams });
            const actionPerformed = true;
        }

        if (newMyWatchlistTeams.length > 0) {
            const results = await createMyWatchlistTeamsDocumentsInDb(newMyWatchlistTeams, getState().default.user._id);
            const updatedData = mergeDocumentsIdsFromDatabaseToObjectsInArray(newMyWatchlistTeams, results);
            dispatch({ type: ADD_MY_WATCHLIST_TEAMS_IN_STORE, data: {myWatchlistTeams: updatedData }});
            const actionPerformed = true;
        }

        if (updatedMyWatchlistTeams.length > 0) {
            await updateMyWatchlistTeamsDocumentsInDb(updatedMyWatchlistTeams);
            dispatch({ type: ADMIN_MY_WATCHLIST_TEAMS_SAVE_CHANGES, data: data.myWatchlistTeams });
            const actionPerformed = true;
        }

        if (deletedMyWatchlistTeams.length > 0) {
            await deleteMyWatchlistTeamsDocumentsInDb(deletedMyWatchlistTeams);
            dispatch({ type: ADMIN_MY_WATCHLIST_TEAMS_SAVE_CHANGES, data: data.myWatchlistTeams });
            const actionPerformed = true;
        }

        if (helpers.doesObjectHaveAnyProperties(updatedAdminFactors)) {
            await updateAdminFactorsDocumentInDb(getState().default.adminFactors._id, updatedAdminFactors);
            dispatch({ type: ADMIN_FACTORS_SAVE_CHANGES, data: data.adminFactors });
            const actionPerformed = true;
        }

        // If saving changes, and none of the actions above are needed, then need to add a timeout so that the 'Changes Saved' dialog appears
        // Otherwise the loadingAdmin: false is batched at the same time as loadingAdmin: true, and therefore loadingAdmin: true never happens
        if (!actionPerformed) await setTimeout(() => {}, 500);

        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingAdmin: false }});
    } catch(error) {
        console.log('Error from adminSaveChanges', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingAdmin: false, loadingBackendError: true }});
    }
}

export const adminCreateFixtures = () => async (dispatch, getState) => {
    try {
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingAdmin: true }});
        const data = { haveRound1FixturesBeenCreated: true };
        await updateMiscellaneousDocumentInDb(getState().default.miscellaneous._id, data);
        dispatch({ type: UPDATE_MISCELLANEOUS_PROPERTY, data });
        const fixturesForCompetition = helperCreateFixtures(getState().default.teamsForCompetition, getState().default.adminFactors[COMPETITION_START_DATE]);
        const results = await createFixturesDocumentsInDb(fixturesForCompetition, getState().default.user._id);
        const updatedData = mergeDocumentsIdsFromFixturesDatabaseToObjectsInArray(fixturesForCompetition, results);
        dispatch({ type: UPDATE_FIXTURES_IN_STORE, data: {fixtures: updatedData }});
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingAdmin: false }});
    } catch(error) {
        console.log('Error from adminCreateFixtures', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingAdmin: false, loadingBackendError: true }});
    }
}

export const adminResetApp = () => async (dispatch, getState) => {
    try {
        const userDetails = getState().default.user;                                // RESET_STATE_TO_DEFAULTS will set authenticated user details back to default values, so get a handle to the current values
        dispatch({ type: RESET_STATE_TO_DEFAULTS });                                // RESET_STATE_TO_DEFAULTS is used in store.js to set the state back to default values
        dispatch({ type: USER_AUTHENTICATION, data: userDetails });                  // Now set the authenticated user details back to the stored values above
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
