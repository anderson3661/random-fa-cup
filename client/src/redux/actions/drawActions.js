import { UPDATE_MISCELLANEOUS_PROPERTY, UPDATE_FIXTURES_IN_STORE, LOADING_BACKEND_UPDATE } from './types';
import { userValidateAndReturnUserDocId, updateMiscellaneousDocumentInDb, createFixturesDocumentsInDb, mergeDocumentsIdsFromFixturesDatabaseToObjectsInArray } from '../../utilities/data-backend';

// ACTION CREATORS

export const updateDbsAndStoreAfterDraw = (fixturesMadeByDraw, competitionRoundForNextDraw) => async (dispatch, getState) => {
    try {
        const userId = await userValidateAndReturnUserDocId();
        if (userId) {
            dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: true }});

            const results = await createFixturesDocumentsInDb(fixturesMadeByDraw, userId);
            const updatedData = mergeDocumentsIdsFromFixturesDatabaseToObjectsInArray(fixturesMadeByDraw, results);
            dispatch({ type: UPDATE_FIXTURES_IN_STORE, data: {fixtures: updatedData }});

            const data = { competitionRoundForNextDraw, okToProceedWithDraw: false };
            await updateMiscellaneousDocumentInDb(getState().default.miscellaneous._id, data);
            dispatch({ type: UPDATE_MISCELLANEOUS_PROPERTY, data });

            if (!getState().default.miscellaneous.hasCompetitionStarted) {
                const data = { hasCompetitionStarted: true };
                await updateMiscellaneousDocumentInDb(getState().default.miscellaneous._id, data);
                dispatch({ type: UPDATE_MISCELLANEOUS_PROPERTY, data });
            }

            dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: false }});
        }
    } catch(error) {
        console.log('Error from updateDbsAndStoreAfterDraw', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loading: false, loadingBackendError: true }});
    }
}
