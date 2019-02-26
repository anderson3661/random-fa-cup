import { TEAMS_DEFAULT, NUMBER_OF_FIXTURES_FOR_SEASON, API_ENDPOINT_USERS, API_ENDPOINT_MISCELLANEOUS, API_ENDPOINT_ADMIN_FACTORS, API_ENDPOINT_TEAMS, API_ENDPOINT_FIXTURES, API_ENDPOINT_LEAGUE_TABLE, API_ENDPOINTS_TO_LOAD_ALL_DATA, HAVE_SEASONS_FIXTURES_BEEN_CREATED } from './constants';
import { getZerosiedTeamInLeagueTable } from './data';
import * as helpers from './helper-functions/helpers';

// const APP_DATA_LOCAL_STORAGE = "football_AppInfo";


export async function isUserAuthenticated(userDetails) {
    try {
        const res = await fetch(API_ENDPOINT_USERS + '/' + userDetails.emailAddress);
        if (!res.ok) throw Error(res.statusText);
        const dataFromUsersDb = await res.json();
        if (userDetails.emailAddress === dataFromUsersDb.emailAddress && userDetails.password === dataFromUsersDb.password) {
            return { ...dataFromUsersDb, authenticated: true }
        } else {
            return { authenticated: false }
        }
    } catch(err) {
        console.log(err);
        throw new Error('Error from isUserAuthenticated');
    }
}

export async function fetchDataFromAllDbs(documentIdInUsersDb) {
    // This is called by the starting function getAppDataFromDb, to load the data from the databases into arrays (and update the Redux store)
    let res;
    let dataFromMiscellaneousDb;
    let dataFromAdminFactorsDb;
    let dataFromTeamsDb;
    let dataFromFixturesDb;
    let dataFromLeagueTableDb;

    try {

        // Get the data from all of the databases
        debugger;
        res = await fetch(API_ENDPOINT_MISCELLANEOUS + "/" + documentIdInUsersDb);
        debugger;
        if (!res.ok) throw Error(res.statusText);
        debugger;
        dataFromMiscellaneousDb = await res.json();
        debugger;
        console.log('dataFromMiscellaneousDb', dataFromMiscellaneousDb);

        res = await fetch(API_ENDPOINT_ADMIN_FACTORS + "/" + documentIdInUsersDb);
        if (!res.ok) throw Error(res.statusText);
        dataFromAdminFactorsDb = await res.json();
        console.log('dataFromAdminFactorsDb', dataFromAdminFactorsDb);

        res = await fetch(API_ENDPOINT_TEAMS + "/" + documentIdInUsersDb);
        if (!res.ok) throw Error(res.statusText);
        dataFromTeamsDb = await res.json();
        console.log('dataFromTeamsDb', dataFromTeamsDb);

        res = await fetch(API_ENDPOINT_FIXTURES + "/" + documentIdInUsersDb);
        if (!res.ok) throw Error(res.statusText);
        dataFromFixturesDb = await res.json();
        // Now format the individual fixtures into sets of fixtures
        let setsOfFixtures = await formatFixtures(dataFromAdminFactorsDb, dataFromFixturesDb);

        res = await fetch(API_ENDPOINT_LEAGUE_TABLE + "/" + documentIdInUsersDb);
        if (!res.ok) throw Error(res.statusText);
        dataFromLeagueTableDb = await res.json();
        console.log('dataFromLeagueTableDb', dataFromLeagueTableDb);
        // Now need to sort the league table
        helpers.sortLatestLeagueTable(dataFromLeagueTableDb);

        return { dataFromMiscellaneousDb, dataFromAdminFactorsDb, dataFromTeamsDb, dataFromFixturesDb, setsOfFixtures, dataFromLeagueTableDb };

    } catch(err) {
        console.log(err);
        throw new Error('Error from fetchDataFromAllDbs');
    }
}

export const errorWithNumbersOfDocumentsInDatabases = (dataFromMiscellaneousDb, dataFromAdminFactorsDb, dataFromTeamsDb, dataFromFixturesDb, setsOfFixtures, dataFromLeagueTableDb) => {
    // Data has been loaded from the databases, but there is one or more inconsistencies with the number of documents
    const numberOfTeams = TEAMS_DEFAULT.length;
    const numberOfFixturesForSeason = dataFromMiscellaneousDb[0][NUMBER_OF_FIXTURES_FOR_SEASON];
    const haveSeasonsFixturesBeenCreated = dataFromMiscellaneousDb[0][HAVE_SEASONS_FIXTURES_BEEN_CREATED];
    console.log('An unknown error has occured with the databases');
    console.log('Documents in Miscellaneous database:', dataFromMiscellaneousDb.length);
    console.log('Documents in Admin Factors database:', dataFromAdminFactorsDb.length);
    console.log('Documents in Teams database:', dataFromTeamsDb.length);
    console.log('Documents in Fixtures database:', dataFromFixturesDb.length);
    console.log('haveSeasonsFixturesBeenCreated in state:', haveSeasonsFixturesBeenCreated);
    console.log('Documents in League Table database:', dataFromLeagueTableDb.length);
    if (dataFromMiscellaneousDb.length !== 1) throw new Error(`There should only be 1 miscellaneous document on the DB, but there are ${dataFromMiscellaneousDb.length}`);
    if (dataFromAdminFactorsDb.length !== 1) throw new Error(`There should only be 1 admin-factors document on the DB, but there are ${dataFromAdminFactorsDb.length}`);
    if (dataFromTeamsDb.length !== numberOfTeams) throw new Error(`There should be ${numberOfTeams} teams documents on the DB, but there are ${dataFromTeamsDb.length}`);
    if (dataFromLeagueTableDb.length !== numberOfTeams) throw new Error(`There should be ${numberOfTeams} league table documents on the DB, but there are ${dataFromLeagueTableDb.length}`);
    if (haveSeasonsFixturesBeenCreated && dataFromFixturesDb.length === 0) throw new Error(`There are 0 fixtures documents on the DB, but haveSeasonsFixturesBeenCreated is true`);
    if (haveSeasonsFixturesBeenCreated && dataFromFixturesDb.length !== numberOfFixturesForSeason * numberOfTeams / 2) throw new Error(`There are ${dataFromFixturesDb.length} fixtures documents on the DB, but there should be ${numberOfFixturesForSeason * numberOfTeams}`);
    if (!haveSeasonsFixturesBeenCreated && dataFromFixturesDb.length !== 0) throw new Error(`There are ${dataFromFixturesDb.length} fixtures documents on the DB, but haveSeasonsFixturesBeenCreated is false`);
    if (setsOfFixtures.length !== 0 && dataFromFixturesDb.length === 0) throw new Error(`There are ${setsOfFixtures.length} sets of fixtures, but there are 0 documents on the fixtures db`);
    if (setsOfFixtures.length !== dataFromFixturesDb.length / numberOfFixturesForSeason) throw new Error(`There are ${setsOfFixtures.length} sets of fixtures, but there but there should be ${dataFromFixturesDb.length / numberOfFixturesForSeason}`);
}

export const doesFixturesDbContainCorrectNumberOfDocuments = (dataFromMiscellaneousDb, dataFromAdminFactorsDb, dataFromFixturesDb, setsOfFixtures) => {
    debugger;
    const numberOfTeams = TEAMS_DEFAULT.length;
    const numberOfFixturesForSeason = dataFromAdminFactorsDb[0][NUMBER_OF_FIXTURES_FOR_SEASON];
    const haveSeasonsFixturesBeenCreated = dataFromMiscellaneousDb[0][HAVE_SEASONS_FIXTURES_BEEN_CREATED];
    return (dataFromFixturesDb.length === 0 && !haveSeasonsFixturesBeenCreated) ||
           (dataFromFixturesDb.length === numberOfTeams * numberOfFixturesForSeason / 2 && setsOfFixtures.length === numberOfFixturesForSeason && haveSeasonsFixturesBeenCreated);
}

const formatFixtures = (resultsAdminFactors, resultsFixtures) => {
    // This is called when fixtures are loaded from the database.  Each fixtures is stored in an individual document on the db, and this function groups them into sets of fixtures
    let numberOfFixturesForSeason;
    let setsOfFixtures;
    let filteredFixtures;
    let singleSetOfFixtures;
    let i;

    setsOfFixtures = [];

    if (resultsFixtures.length > 0) {
        numberOfFixturesForSeason = resultsAdminFactors[0].numberOfFixturesForSeason;

        for (i = 1; i <= numberOfFixturesForSeason; i++) {
            filteredFixtures = resultsFixtures.filter(fixture => fixture.setOfFixturesNumber === i);
            singleSetOfFixtures = { fixtures: [...filteredFixtures], dateOfSetOfFixtures: filteredFixtures[0].dateOfFixture}
            setsOfFixtures.push(singleSetOfFixtures);
        }
    }

    return setsOfFixtures;
}

export const deleteAllDocumentsInDbs = (documentIdInUsersDb) => {

    try {

        // Maps each URL into a fetch() Promise
        const requests = API_ENDPOINTS_TO_LOAD_ALL_DATA.map(url => {
            return fetch(url + "/" + documentIdInUsersDb, { method: 'DELETE' })
                   .then(response => response.json())
        });

        // Resolve all the promises - return the Promise to the calling function
        return Promise.all(requests)
            // .then(results => console.log(JSON.stringify(results, null, 2)))
            .catch(error => {
                throw Error("There is an error attempting to delete all of the documents in all of the databases ..." + error);       // Throw an error so that the promise returns rejected
        });
       
    } catch(error) {
        console.log(error);
        throw new Error('Error in deleteAllDocumentsInAllDbs');
    }
}

export const createDocumentInASingleDocumentDb = (obj, apiEndpoint, dbDescription, documentIdInUsersDb) => {
    // This function is called when the app is reset, or the app is loaded for the first time after the user has registered.
    // The Miscellaneous document in the database is a single document which stores various values required by the app.
    // The AdminFactors document in the database is a single document which stores the values entered (excluding teams) on the Administration screen.

    try {
        if (documentIdInUsersDb) obj.userDocumentId = documentIdInUsersDb;
        return sendDataToAPIEndpoint(apiEndpoint, dbDescription, 'POST', obj);
    } catch(error) {
        throw new Error(`Error creating ${dbDescription} document in db`, error);
    }
}

export const createTeamsDocumentsInDb = (documentIdInUsersDb) => {
    // This function is called when the app is reset, or the app is loaded for the first time after the user has registered.
    // The Team documents in the database just store a document for each team with the team's name and whether the team is 'a top team'.
    let numberOfTeams = TEAMS_DEFAULT.length;
    let bulkData = [];
    let i;

    for (i = 0; i < numberOfTeams; i++) {
        bulkData.push({
            insertOne: {
                document: { ...TEAMS_DEFAULT[i], userDocumentId: documentIdInUsersDb }
            }
        });
    }

    try {
        return sendDataToAPIEndpoint(API_ENDPOINT_TEAMS, 'Team', 'POST', bulkData);
    } catch(error) {
        throw new Error('Error creating Team documents in db', error);
    }
}

export const createLeagueTableDocumentsInDb = (documentIdInUsersDb) => {
    // This function is called when the app is reset, or the app is loaded for the first time after the user has registered.
    // The LeagueTable documents in the database just store a document for each team with details of games played, points, wins, goals etc.
    let numberOfTeams = TEAMS_DEFAULT.length;
    let bulkData = [];
    let i;

    for (i = 0; i < numberOfTeams; i++) {
        bulkData.push({
            insertOne: {
                document: { ...getZerosiedTeamInLeagueTable(TEAMS_DEFAULT[i].teamName), userDocumentId: documentIdInUsersDb }
            }
        });
    }

    try {
        return sendDataToAPIEndpoint(API_ENDPOINT_LEAGUE_TABLE, 'League Table', 'POST', bulkData);
    } catch(error) {
        throw new Error('Error creating LeagueTable documents in db', error);
    }
}

export const createFixturesDocumentsInDb = (fixturesForSeason, documentIdInUsersDb) => {
    // This function is called when "Create Season's Fixtures" is used on the Administration screen
    let bulkData = [];
    let i;
    let j;

    for (i = 0; i < fixturesForSeason.length; i++) {
        for (j = 0; j < fixturesForSeason[i].fixtures.length; j++) {
            bulkData.push({
                insertOne: {
                    document: {
                        ...fixturesForSeason[i].fixtures[j],
                        dateOfFixture: fixturesForSeason[i].dateOfSetOfFixtures,
                        setOfFixturesNumber: i + 1,
                        fixtureNumber: j + 1,
                        userDocumentId: documentIdInUsersDb,
                    }
                }
            });
        }
    }

    try {
        return sendDataToAPIEndpoint(API_ENDPOINT_FIXTURES, 'Fixtures', 'POST', bulkData);
    } catch(error) {
        throw new Error('Error creating Fixture documents in db', error);
    }
}

export const mergeDocumentsIdsFromDatabaseToObjectsInArray = (originalArray, resultsFromAPICall) => {
    // Add the newly created ids from the documents in the database to the array in memory
    return originalArray.map((objectInArray, i) => Object.assign({}, objectInArray, resultsFromAPICall.insertedIds[i]));
}

export const mergeDocumentsIdsFromFixturesDatabaseToObjectsInArray = (originalArray, resultsFromAPICall) => {
    // Add the newly created ids from the documents in the database to the array in memory
    let updatedValues = [];
    let arrayElement;

    // Sets of Fixtures are in an array with sub-arrays, each of 10 fixtures, so need to add the id of each document in a slightly different way
    resultsFromAPICall.insertedIds.forEach((objectInArray, i) => {
        arrayElement = parseInt(i / 10);
        originalArray[arrayElement].fixtures[i - arrayElement * 10] = Object.assign({}, originalArray[arrayElement].fixtures[i - arrayElement * 10], resultsFromAPICall.insertedIds[i]);
        if (i%10 === 9) updatedValues.push(originalArray[arrayElement]);
    });

    return updatedValues;
}

export const updateTeamsDocumentsInDb = (updatedValues) => {
    // This function is called when changes to the teams on the Administration screen are then saved
    let bulkData = [];

        updatedValues.forEach(updatedValue => {
            bulkData.push({
                updateOne: {
                    filter: { _id: updatedValue._id },
                    update: updatedValue
                }
            });        
        });

        sendDataToAPIEndpoint(API_ENDPOINT_TEAMS, 'Team', 'PUT', bulkData);
}

export async function updateDocumentsInDbAfterLatestResults(sourceArray, apiEndpoint, dbDescription) {
    // After the results of the latest fixtures, this function updates documents in the appropriate database.
    // Each 'fixture' or 'team for league table' is stored as a separate document in the database, so the API uses bulkWrite to batch all of the results into one http request.
    let bulkData = [];
    let i;

    for (i = 0; i < sourceArray.length; i++) {
        bulkData.push({
            updateOne: {
                filter: { _id: sourceArray[i]._id },
                update: sourceArray[i]
            }
        });        
    }

    await sendDataToAPIEndpoint(apiEndpoint, dbDescription, 'PUT', bulkData);
}

export const updateMiscellaneousDocumentInDb = (miscellaneousDocumentIdInDb, changes) => {
    return sendDataToAPIEndpoint(API_ENDPOINT_MISCELLANEOUS + "/" + miscellaneousDocumentIdInDb, 'Miscellaneous', 'PUT', changes);
}

export const updateAdminFactorsDocumentInDb = (adminFactorsDocumentIdInDb, changes) => {
    return sendDataToAPIEndpoint(API_ENDPOINT_ADMIN_FACTORS + "/" + adminFactorsDocumentIdInDb, 'Admin Factors', 'PUT', changes);
}

async function sendDataToAPIEndpoint(apiEndpoint, dataName, method, dataToSend) {
    // This function sends data to the appropriate API endpoint
    let res;
    let results;

    try {
        res = await fetch(apiEndpoint, { method: method, body: JSON.stringify(dataToSend), headers: { 'Content-Type': 'application/json'} });

        if (res.ok) {
            results = await res.json();
            console.log('results', results);
            const plural = (apiEndpoint === API_ENDPOINT_ADMIN_FACTORS ? '' : 's');
            console.log(`${dataName} document${plural} successfully ${method === 'POST' ? 'created' : (method === 'PUT' ? 'updated' : method)} in db`);
            return Promise.resolve(results);
        } else {
            throw Error(res);
        }
    } catch {
        console.log(`ERROR ... ${method === 'POST' ? 'creating' : (method === 'PUT' ? 'updating' : method)} ${dataName} documents in db`);
        throw new Error(`apiEndpoint - ${res.status} - ${res.statusText} - ${res.url}`)
    }
}