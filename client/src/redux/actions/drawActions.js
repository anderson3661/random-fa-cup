import { UPDATE_MISCELLANEOUS_PROPERTY, UPDATE_FIXTURES_IN_STORE, LOADING_BACKEND_UPDATE } from './types';
import { updateMiscellaneousDocumentInDb, createFixturesDocumentsInDb, mergeDocumentsIdsFromFixturesDatabaseToObjectsInArray } from '../../utilities/data-backend';


// ACTION CREATORS

export const updateDbsAndStoreAfterDraw = (fixturesMadeByDraw) => async (dispatch, getState) => {
    try {
        debugger;
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingDraw: true }});
        const results = await createFixturesDocumentsInDb(fixturesMadeByDraw, getState().default.user._id);
        const updatedData = mergeDocumentsIdsFromFixturesDatabaseToObjectsInArray(fixturesMadeByDraw, results);
        dispatch({ type: UPDATE_FIXTURES_IN_STORE, data: {fixtures: updatedData }});

        if (!getState().default.miscellaneous.hasCompetitionStarted) {
            const data = { hasCompetitionStarted: true };
            await updateMiscellaneousDocumentInDb(getState().default.miscellaneous._id, data);
            dispatch({ type: UPDATE_MISCELLANEOUS_PROPERTY, data });
        }
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingDraw: false }});
    } catch(error) {
        console.log('Error from updateDbsAndStoreAfterDraw', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingDraw: false, loadingBackendError: true }});
    }
}
