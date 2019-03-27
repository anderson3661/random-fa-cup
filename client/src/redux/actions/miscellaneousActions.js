import { LOAD_FROM_MISCELLANEOUS_DB, LOAD_FROM_SETTINGS_FACTORS_DB, LOAD_FROM_TEAMS_DB, LOAD_FROM_MY_WATCHLIST_TEAMS_DB, LOAD_FROM_FIXTURES_DB, LOAD_FROM_ALL_DBS_FINISHED, MERGE_DOCUMENT_IDS_FROM_TEAMS_DB, LOADING_BACKEND_UPDATE } from './types';
import { getSettingsFactors } from '../../components/settings/settings-helpers';
import { fetchDataFromAllDbs, errorWithNumbersOfDocumentsInDatabases, doesFixturesDbContainCorrectNumberOfDocuments, createDocumentInASingleDocumentDb, createTeamsDocumentsInDb, mergeDocumentsIdsFromDatabaseToObjectsInArray } from '../../utilities/data-backend';
import { API_ENDPOINT_MISCELLANEOUS, API_ENDPOINT_SETTINGS_FACTORS, NUMBER_OF_TEAMS } from '../../utilities/constants';

// ACTION CREATORS

export const loadFromAllDbsStarted = () => async (dispatch, getState) => {
    try {
        let results = await fetchDataFromAllDbs(getState().default.user._id);
        let { dataFromMiscellaneousDb, dataFromSettingsFactorsDb, dataFromTeamsDb, teamsByDivision, dataFromMyWatchlistTeamsDb, dataFromFixturesDb, setsOfFixtures } = results;
        if (dataFromMiscellaneousDb.length === 0 && dataFromSettingsFactorsDb.length === 0 && dataFromTeamsDb.length === 0 && dataFromFixturesDb.length === 0) {
            console.log('No documents exist in any of the databases ... create documents in the database from the app defaults');
            dispatch(createDocumentsInDbsFromAppDefaults(getState().default.user._id));
            dispatch({ type: LOAD_FROM_ALL_DBS_FINISHED, data: { loading: false }});
        } else if (dataFromMiscellaneousDb.length === 1 && dataFromSettingsFactorsDb.length === 1 && dataFromTeamsDb.length === NUMBER_OF_TEAMS &&
                  (dataFromFixturesDb.length === 0 || doesFixturesDbContainCorrectNumberOfDocuments(dataFromMiscellaneousDb, dataFromSettingsFactorsDb, dataFromFixturesDb, setsOfFixtures))) {
            // console.log(`Data has been loaded from the databases ... the user has not yet created fixtures`);
            console.log(`Data has been loaded from the databases`);
            dispatch({ type: LOAD_FROM_MISCELLANEOUS_DB, data: dataFromMiscellaneousDb[0] });        // As the api call result returns an array just need to send the [0] element
            dispatch({ type: LOAD_FROM_SETTINGS_FACTORS_DB, data: dataFromSettingsFactorsDb[0] });         // As the api call result returns an array just need to send the [0] element
            dispatch({ type: LOAD_FROM_TEAMS_DB, data: teamsByDivision });
            dispatch({ type: LOAD_FROM_MY_WATCHLIST_TEAMS_DB, data: dataFromMyWatchlistTeamsDb });
            dispatch({ type: LOAD_FROM_FIXTURES_DB, data: (dataFromFixturesDb === 0 ? dataFromFixturesDb : setsOfFixtures) });
            dispatch({ type: LOAD_FROM_ALL_DBS_FINISHED, data: { loading: false }});
        } else {
            errorWithNumbersOfDocumentsInDatabases(dataFromMiscellaneousDb, dataFromSettingsFactorsDb, dataFromTeamsDb, teamsByDivision, dataFromMyWatchlistTeamsDb, dataFromFixturesDb, setsOfFixtures);
        }
    } catch(error) {
        console.log('Error from loadFromAllDbsStarted', error);
        dispatch({ type: LOADING_BACKEND_UPDATE, data: { loadingBackendError: true }});
    }
}

export const createDocumentsInDbsFromAppDefaults = (documentIdInUsersDb) => async (dispatch, getState) => {
    // This is called a) when the user accesses the app for the first time where there aren't any documents in any of the databases,
    // and b) when the user does a reset of the app which means that documents are either created from the defaults, or based on what is currently in the store
    // (i.e. they might have made changes to the teams or factors on the Settings screen).
    let results;
    let updatedData;

    try {
        results = await createDocumentInASingleDocumentDb(getState().default.miscellaneous, API_ENDPOINT_MISCELLANEOUS, 'Miscellaneous', documentIdInUsersDb);
        dispatch({ type: LOAD_FROM_MISCELLANEOUS_DB, data: results });            // The API call returns an object so update the store
        
        // FIELD_GOALS_PER_MINUTE_FACTOR is stored as a string so need to convert it to an array so that it gets saved in the database as an array
        results = await createDocumentInASingleDocumentDb(getSettingsFactors(getState().default.settingsFactors, true, true, 'array'), API_ENDPOINT_SETTINGS_FACTORS, 'SettingsFactors', documentIdInUsersDb);
        dispatch({ type: LOAD_FROM_SETTINGS_FACTORS_DB, data: results });            // The API call returns an object so update the store
        
        results = await createTeamsDocumentsInDb(documentIdInUsersDb);
        updatedData = await mergeDocumentsIdsFromDatabaseToObjectsInArray(getState().default.teamsForCompetition, results);
        dispatch({ type: MERGE_DOCUMENT_IDS_FROM_TEAMS_DB, data: updatedData });

    } catch(error) {
        throw new Error(error);
    }
}