import { UPDATE_FIXTURES_IN_STORE, UPDATE_MISCELLANEOUS_PROPERTY, LOADING_BACKEND_UPDATE } from './types';
import { updateDocumentsInDbAfterLatestResults, updateMiscellaneousDocumentInDb, createFixturesDocumentsInDb, mergeDocumentsIdsFromFixturesDatabaseToObjectsInArray } from '../../utilities/data-backend';
import { API_ENDPOINT_FIXTURES } from '../../utilities/constants';

// ACTION CREATORS

export const updateDbsAndStoreAfterLatestResults = (latestFixtures, replays, replayUpdatesInFixturesDb, replayUpdatesInStore, finalFixture, miscellaneousUpdates) => async (dispatch, getState) => {
    try {

        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingLatestFixtures: true }});
        await updateDocumentsInDbAfterLatestResults(latestFixtures, API_ENDPOINT_FIXTURES, 'Fixtures');
        dispatch({ type: UPDATE_FIXTURES_IN_STORE, data: { fixtures: latestFixtures }});

        if (replays.length > 0) {
            const results = await createFixturesDocumentsInDb(replays, getState().default.user._id);
            const updatedData = mergeDocumentsIdsFromFixturesDatabaseToObjectsInArray(replays, results);
            dispatch({ type: UPDATE_FIXTURES_IN_STORE, data: {fixtures: updatedData }});
        }

        if (replayUpdatesInFixturesDb.length > 0) {
            await updateDocumentsInDbAfterLatestResults(replayUpdatesInFixturesDb, API_ENDPOINT_FIXTURES, 'Fixtures');
            dispatch({ type: UPDATE_FIXTURES_IN_STORE, data: { fixtures: replayUpdatesInStore }});
        }

        if (finalFixture.length > 0) {
            const results = await createFixturesDocumentsInDb(finalFixture, getState().default.user._id);

            const updatedData = mergeDocumentsIdsFromFixturesDatabaseToObjectsInArray(finalFixture, results);
            dispatch({ type: UPDATE_FIXTURES_IN_STORE, data: {fixtures: updatedData }});
        }

        if (!getState().default.miscellaneous.hasCompetitionStarted) {
            const miscellaneousPropertiesToUpdate = { hasCompetitionStarted: true };
            await updateMiscellaneousDocumentInDb(getState().default.miscellaneous._id, miscellaneousPropertiesToUpdate);
            dispatch({ type: UPDATE_MISCELLANEOUS_PROPERTY, data: { ...miscellaneousPropertiesToUpdate }});
        }

        await updateMiscellaneousDocumentInDb(getState().default.miscellaneous._id, miscellaneousUpdates);
        dispatch({ type: UPDATE_MISCELLANEOUS_PROPERTY, data: miscellaneousUpdates });

        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingLatestFixtures: false }});
    } catch(error) {
        console.log('Error from updateDbsAndStoreAfterLatestResults', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingLatestFixtures: false, loadingBackendError: true }});
    }
}

export const updateDbsAndStoreAfterCompetitionHasFinished = () => async (dispatch, getState) => {
    // As Season Has Finished is updated on ComponentWillDismount in Latest Fixtures component, then no need to display loading spinner as router change will take care of temporary delay
    try {
        await updateMiscellaneousDocumentInDb(getState().default.miscellaneous._id, { hasCompetitionFinished: true });
        dispatch({ type: UPDATE_MISCELLANEOUS_PROPERTY, data: { hasCompetitionFinished: true }});
    } catch(error) {
        console.log('Error from updateDbsAndStoreAfterCompetitionHasFinished', error);
    }
}