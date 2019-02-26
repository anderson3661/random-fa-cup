import { UPDATE_FIXTURES_IN_STORE_AFTER_RESULTS, UPDATE_LEAGUE_TABLE_IN_STORE_AFTER_RESULTS, UPDATE_MISCELLANEOUS_PROPERTY, LOADING_BACKEND_UPDATE } from './types';
import { updateDocumentsInDbAfterLatestResults, updateMiscellaneousDocumentInDb } from '../../utilities/data-backend';
import { API_ENDPOINT_FIXTURES, API_ENDPOINT_LEAGUE_TABLE } from '../../utilities/constants';

// ACTION CREATORS

export const updateDbsAndStoreAfterLatestResults = (latestFixtures, leagueTable, dateOfLastSetOfFixtures) => async (dispatch, getState) => {
    try {
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingLatestFixtures: true }});
        await updateDocumentsInDbAfterLatestResults(latestFixtures, API_ENDPOINT_FIXTURES, 'Fixtures');
        await updateDocumentsInDbAfterLatestResults(leagueTable, API_ENDPOINT_LEAGUE_TABLE, 'League Table');
        const miscellaneousPropertiesToUpdate = { hasSeasonStarted: true, dateOfLastSetOfFixtures };
        await updateMiscellaneousDocumentInDb(getState().default.miscellaneous._id, miscellaneousPropertiesToUpdate);
        dispatch({ type: UPDATE_FIXTURES_IN_STORE_AFTER_RESULTS, data: { latestFixtures, ...miscellaneousPropertiesToUpdate }});
        dispatch({ type: UPDATE_LEAGUE_TABLE_IN_STORE_AFTER_RESULTS, data: { leagueTable } });
        dispatch({ type: UPDATE_MISCELLANEOUS_PROPERTY, data: { ...miscellaneousPropertiesToUpdate }});
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingLatestFixtures: false }});
    } catch(error) {
        console.log('Error from latestFixturesHaveFinishedMain', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingLatestFixtures: false, loadingBackendError: true }});
    }
}

export const updateDbsAndStoreAfterSeasonHasFinished = () => async (dispatch, getState) => {
    // As Season Has Finished is updated on ComponentWillDismount in Latest Fixtures component, then no need to display loading spinner as router change will take care of temporary delay
    try {
        await updateMiscellaneousDocumentInDb(getState().default.miscellaneous._id, { hasSeasonFinished: true });
        dispatch({ type: UPDATE_MISCELLANEOUS_PROPERTY, data: { hasSeasonFinished: true }});
    } catch(error) {
        console.log('Error from updateDbsAndStoreAfterSeasonHasFinished', error);
    }
}