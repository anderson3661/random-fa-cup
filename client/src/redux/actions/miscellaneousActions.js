import { LOAD_FROM_MISCELLANEOUS_DB, LOAD_FROM_ADMIN_FACTORS_DB, LOAD_FROM_TEAMS_DB, LOAD_FROM_FIXTURES_DB, LOAD_FROM_LEAGUE_TABLE_DB, LOAD_FROM_ALL_DBS_FINISHED, MERGE_DOCUMENT_IDS_FROM_TEAMS_DB, MERGE_DOCUMENT_IDS_FROM_LEAGUE_TABLE_DB, LOADING_BACKEND_UPDATE } from './types';
import { getAdminFactors } from '../../utilities/data';
import { fetchDataFromAllDbs, errorWithNumbersOfDocumentsInDatabases, doesFixturesDbContainCorrectNumberOfDocuments, createDocumentInASingleDocumentDb, createTeamsDocumentsInDb, createLeagueTableDocumentsInDb, mergeDocumentsIdsFromDatabaseToObjectsInArray } from '../../utilities/data-backend';
import { TEAMS_DEFAULT, API_ENDPOINT_MISCELLANEOUS, API_ENDPOINT_ADMIN_FACTORS } from '../../utilities/constants';

// ACTION CREATORS

export const loadFromAllDbsStarted = () => async (dispatch, getState) => {
    try {
        let results = await fetchDataFromAllDbs(getState().default.user._id);
        let { dataFromMiscellaneousDb, dataFromAdminFactorsDb, dataFromTeamsDb, dataFromFixturesDb, setsOfFixtures, dataFromLeagueTableDb } = results;
        if (dataFromMiscellaneousDb.length === 0 && dataFromAdminFactorsDb.length === 0 && dataFromTeamsDb.length === 0 && dataFromFixturesDb.length === 0 && dataFromLeagueTableDb.length === 0) {
            console.log('No documents exist in any of the databases ... create documents in the database from the app defaults');
            dispatch(createDocumentsInDbsFromAppDefaults());
            dispatch({ type: LOAD_FROM_ALL_DBS_FINISHED, data: { loading: false }});
        } else if (dataFromMiscellaneousDb.length === 1 && dataFromAdminFactorsDb.length === 1 && dataFromTeamsDb.length === TEAMS_DEFAULT.length && dataFromLeagueTableDb.length === TEAMS_DEFAULT.length &&
                  (dataFromFixturesDb.length === 0 || doesFixturesDbContainCorrectNumberOfDocuments(dataFromMiscellaneousDb, dataFromAdminFactorsDb, dataFromFixturesDb, setsOfFixtures))) {
            console.log(`Data has been loaded from the databases ... the user has not yet created fixtures`);
            dispatch({ type: LOAD_FROM_MISCELLANEOUS_DB, data: dataFromMiscellaneousDb[0] });        // As the api call result returns an array just need to send the [0] element
            dispatch({ type: LOAD_FROM_ADMIN_FACTORS_DB, data: dataFromAdminFactorsDb[0] });         // As the api call result returns an array just need to send the [0] element
            dispatch({ type: LOAD_FROM_TEAMS_DB, data: dataFromTeamsDb });
            dispatch({ type: LOAD_FROM_FIXTURES_DB, data: (dataFromFixturesDb === 0 ? dataFromFixturesDb : setsOfFixtures) });
            dispatch({ type: LOAD_FROM_LEAGUE_TABLE_DB, data: dataFromLeagueTableDb });
            dispatch({ type: LOAD_FROM_ALL_DBS_FINISHED, data: { loading: false }});
        } else {
            errorWithNumbersOfDocumentsInDatabases(dataFromMiscellaneousDb, dataFromAdminFactorsDb, dataFromTeamsDb, dataFromFixturesDb, setsOfFixtures, dataFromLeagueTableDb);
        }
    } catch(error) {
        console.log('Error from loadFromAllDbsStarted', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingBackendError: true }});
    }
}

export const createDocumentsInDbsFromAppDefaults = (documentIdInUsersDb) => async (dispatch, getState) => {
    // This is called a) when the user accesses the app for the first time where there aren't any documents in any of the databases,
    // and b) when the user does a reset of the app which means that documents are either created from the defaults, or based on what is currently in the store
    // (i.e. they might have made changes to the teams or factors on the Administration screen).
    let results;
    let updatedData;

    debugger;

    try {
        results = await createDocumentInASingleDocumentDb(getState().default.miscellaneous, API_ENDPOINT_MISCELLANEOUS, 'Miscellaneous', documentIdInUsersDb);
        dispatch({ type: LOAD_FROM_MISCELLANEOUS_DB, data: results });            // The API call returns an object so update the store
        
        // FIELD_GOALS_PER_MINUTE_FACTOR is stored as a string so need to convert it to an array so that it gets saved in the database as an array
        results = await createDocumentInASingleDocumentDb(getAdminFactors(getState().default.adminFactors, true, true, 'array'), API_ENDPOINT_ADMIN_FACTORS, 'AdminFactors', documentIdInUsersDb);
        dispatch({ type: LOAD_FROM_ADMIN_FACTORS_DB, data: results });            // The API call returns an object so update the store
        
        results = await createTeamsDocumentsInDb(documentIdInUsersDb);
        updatedData = await mergeDocumentsIdsFromDatabaseToObjectsInArray(getState().default.teamsForSeason, results);
        dispatch({ type: MERGE_DOCUMENT_IDS_FROM_TEAMS_DB, data: updatedData });
        
        results = await createLeagueTableDocumentsInDb(documentIdInUsersDb);
        updatedData = await mergeDocumentsIdsFromDatabaseToObjectsInArray(getState().default.leagueTable, results);
        dispatch({ type: MERGE_DOCUMENT_IDS_FROM_LEAGUE_TABLE_DB, data: updatedData });

    } catch(error) {
        throw new Error(error);
    }
}