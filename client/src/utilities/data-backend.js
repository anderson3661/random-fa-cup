import { TEAMS_DEFAULT, FIXTURES_DEFAULT, COMPETITION_ROUNDS, COMPETITION_ROUNDS_FIXTURES, API_ENDPOINT_USERS, API_ENDPOINT_MISCELLANEOUS, API_ENDPOINT_SETTINGS_FACTORS, API_ENDPOINT_TEAMS, API_ENDPOINT_MY_WATCHLIST_TEAMS, API_ENDPOINT_FIXTURES, API_ENDPOINTS_TO_DELETE_ALL_DATA, API_ENDPOINTS_TO_DELETE_KEEP_CURRENT_SETTINGS, HAVE_SEASONS_FIXTURES_BEEN_CREATED, DIVISIONS, NUMBER_OF_TEAMS } from './constants';

// const APP_DATA_LOCAL_STORAGE = "football_AppInfo";


export async function isUserAuthenticated(userDetails) {
    try {
        const res = await fetch(API_ENDPOINT_USERS + '/' + userDetails.emailAddress);
        if (!res.ok) throw Error(res.statusText);
        const dataFromUsersDb = await res.json();
        if (dataFromUsersDb && userDetails.emailAddress === dataFromUsersDb.emailAddress && userDetails.password === dataFromUsersDb.password) {
            return { ...dataFromUsersDb, authenticated: true }
        } else {
            return { authenticated: false }
        }
    } catch(err) {
        console.log(err);
        throw new Error('Error from isUserAuthenticated');
    }
}

export async function userSignUpDoesUserAlreadyExist(userDetails) {
    try {
        const res = await fetch(API_ENDPOINT_USERS + '/' + userDetails.emailAddress);
        if (!res.ok) throw Error(res.statusText);
        const dataFromUsersDb = await res.json();
        return dataFromUsersDb && userDetails.emailAddress === dataFromUsersDb.emailAddress;
    } catch(err) {
        console.log(err);
        throw new Error('Error from userSignUpDoesUserAlreadyExist');
    }
}

export async function fetchDataFromAllDbs(documentIdInUsersDb) {
    // This is called by the starting function getAppDataFromDb, to load the data from the databases into arrays (and update the Redux store)
    let res;
    let dataFromMiscellaneousDb;
    let dataFromSettingsFactorsDb;
    let dataFromTeamsDb;
    let dataFromMyWatchlistTeamsDb;
    let dataFromFixturesDb;

    try {

        // Get the data from all of the databases
        res = await fetch(API_ENDPOINT_MISCELLANEOUS + "/" + documentIdInUsersDb);
        if (!res.ok) throw Error(res.statusText);
        dataFromMiscellaneousDb = await res.json();
        console.log('dataFromMiscellaneousDb', dataFromMiscellaneousDb);

        res = await fetch(API_ENDPOINT_SETTINGS_FACTORS + "/" + documentIdInUsersDb);
        if (!res.ok) throw Error(res.statusText);
        dataFromSettingsFactorsDb = await res.json();
        console.log('dataFromSettingsFactorsDb', dataFromSettingsFactorsDb);

        res = await fetch(API_ENDPOINT_TEAMS + "/" + documentIdInUsersDb);
        if (!res.ok) throw Error(res.statusText);
        dataFromTeamsDb = await res.json();
        console.log('dataFromTeamsDb', dataFromTeamsDb);
        let teamsByDivision = await formatTeams(dataFromTeamsDb);

        res = await fetch(API_ENDPOINT_MY_WATCHLIST_TEAMS + "/" + documentIdInUsersDb);
        if (!res.ok) throw Error(res.statusText);
        dataFromMyWatchlistTeamsDb = await res.json();
        console.log('dataFromMyWatchlistTeamsDb', dataFromMyWatchlistTeamsDb);

        res = await fetch(API_ENDPOINT_FIXTURES + "/" + documentIdInUsersDb);
        if (!res.ok) throw Error(res.statusText);
        dataFromFixturesDb = await res.json();
        console.log('dataFromFixturesDb', dataFromFixturesDb);
        // Now format the individual fixtures into sets of fixtures
        let setsOfFixtures = await formatFixtures(dataFromFixturesDb);

        return { dataFromMiscellaneousDb, dataFromSettingsFactorsDb, dataFromTeamsDb, teamsByDivision, dataFromMyWatchlistTeamsDb, dataFromFixturesDb, setsOfFixtures };

    } catch(err) {
        console.log(err);
        throw new Error('Error from fetchDataFromAllDbs');
    }
}

export const errorWithNumbersOfDocumentsInDatabases = (dataFromMiscellaneousDb, dataFromSettingsFactorsDb, dataFromTeamsDb, teamsByDivision, dataFromMyWatchlistTeamsDb, dataFromFixturesDb, setsOfFixtures) => {
    // Data has been loaded from the databases, but there is one or more inconsistencies with the number of documents
    // const numberOffixturesForCompetition = dataFromMiscellaneousDb[0][NUMBER_OF_FIXTURES_FOR_SEASON];
    const haveSeasonsFixturesBeenCreated = dataFromMiscellaneousDb[0][HAVE_SEASONS_FIXTURES_BEEN_CREATED];
    console.log('An unknown error has occured with the databases');
    console.log('Documents in Miscellaneous database:', dataFromMiscellaneousDb.length);
    console.log('Documents in Settings Factors database:', dataFromSettingsFactorsDb.length);
    console.log('Documents in Teams database:', dataFromTeamsDb.length);
    console.log('Documents in My Watchlist Teams database:', dataFromMyWatchlistTeamsDb.length);
    console.log('Documents in Fixtures database:', dataFromFixturesDb.length);
    console.log('haveSeasonsFixturesBeenCreated in state:', haveSeasonsFixturesBeenCreated);
    if (dataFromMiscellaneousDb.length !== 1) throw new Error(`There should only be 1 miscellaneous document on the DB, but there are ${dataFromMiscellaneousDb.length}`);
    if (dataFromSettingsFactorsDb.length !== 1) throw new Error(`There should only be 1 setting-factors document on the DB, but there are ${dataFromSettingsFactorsDb.length}`);
    if (dataFromTeamsDb.length !== NUMBER_OF_TEAMS) throw new Error(`There should be ${NUMBER_OF_TEAMS} teams documents on the DB, but there are ${dataFromTeamsDb.length}`);
    if (haveSeasonsFixturesBeenCreated && dataFromFixturesDb.length === 0) throw new Error(`There are 0 fixtures documents on the DB, but haveSeasonsFixturesBeenCreated is true`);
    // if (haveSeasonsFixturesBeenCreated && dataFromFixturesDb.length !== numberOffixturesForCompetition * numberOfTeams / 2) throw new Error(`There are ${dataFromFixturesDb.length} fixtures documents on the DB, but there should be ${numberOffixturesForCompetition * numberOfTeams}`);
    if (!haveSeasonsFixturesBeenCreated && dataFromFixturesDb.length !== 0) throw new Error(`There are ${dataFromFixturesDb.length} fixtures documents on the DB, but haveSeasonsFixturesBeenCreated is false`);
    if (setsOfFixtures.length !== 0 && dataFromFixturesDb.length === 0) throw new Error(`There are ${setsOfFixtures.length} sets of fixtures, but there are 0 documents on the fixtures db`);
    // if (setsOfFixtures.length !== dataFromFixturesDb.length / numberOffixturesForCompetition) throw new Error(`There are ${setsOfFixtures.length} sets of fixtures, but there but there should be ${dataFromFixturesDb.length / numberOffixturesForCompetition}`);
}

export const doesFixturesDbContainCorrectNumberOfDocuments = (dataFromMiscellaneousDb, dataFromSettingsFactorsDb, dataFromFixturesDb, setsOfFixtures) => {
    const numberOfTeams = TEAMS_DEFAULT.length;
    // const numberOffixturesForCompetition = dataFromSettingsFactorsDb[0][NUMBER_OF_FIXTURES_FOR_SEASON];
    const numberOffixturesForCompetition = 0;
    const haveSeasonsFixturesBeenCreated = dataFromMiscellaneousDb[0][HAVE_SEASONS_FIXTURES_BEEN_CREATED];
    return true;
    // return (dataFromFixturesDb.length === 0 && !haveSeasonsFixturesBeenCreated) ||
    //        (dataFromFixturesDb.length === numberOfTeams * numberOffixturesForCompetition / 2 && setsOfFixtures.length === numberOffixturesForCompetition && haveSeasonsFixturesBeenCreated);
}

const formatTeams = (resultsTeams) => {
    // This is called when teams are loaded from the database.  Each team is stored in an individual document on the db, and this function groups them into sets of divisions
    let teamsByDivision;
    let filteredTeams;
    let i;

    teamsByDivision = [];

    if (resultsTeams.length > 0) {
        for (i = 0; i < DIVISIONS.length; i++) {
            filteredTeams = resultsTeams.filter(team => team.division === DIVISIONS[i]);
            teamsByDivision.push({ [DIVISIONS[i]]: filteredTeams });
        }
    }

    return teamsByDivision;
}

const formatFixtures = (resultsFixtures) => {
    // This is called when fixtures are loaded from the database.  Each fixtures is stored in an individual document on the db, and this function groups them into sets of fixtures
    let setsOfFixtures;
    let filteredFixtures;

    setsOfFixtures = [...FIXTURES_DEFAULT];

    if (resultsFixtures.length > 0) {
        COMPETITION_ROUNDS.forEach((competitionRound, i) => {
            filteredFixtures = resultsFixtures.filter(fixture => fixture.competitionRound === competitionRound && !fixture.isReplay);
            setsOfFixtures[i][COMPETITION_ROUNDS_FIXTURES[i] + 'Fixtures'] = filteredFixtures;
            if (setsOfFixtures[i].replaysAllowed) {
                filteredFixtures = resultsFixtures.filter(fixture => fixture.competitionRound === competitionRound && fixture.isReplay);
                setsOfFixtures[i][COMPETITION_ROUNDS_FIXTURES[i] + 'Replays'] = filteredFixtures;
            }
        });
    }

    return setsOfFixtures;
}

export const deleteAllDocumentsInDbs = (documentIdInUsersDb) => {

    try {

        // Maps each URL into a fetch() Promise
        const requests = API_ENDPOINTS_TO_DELETE_ALL_DATA.map(url => {
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

export const deleteAllDocumentsInDbsKeepCurrentSettings = (documentIdInUsersDb) => {

    try {

        // Maps each URL into a fetch() Promise
        const requests = API_ENDPOINTS_TO_DELETE_KEEP_CURRENT_SETTINGS.map(url => {
            return fetch(url + "/" + documentIdInUsersDb, { method: 'DELETE' })
                   .then(response => response.json())
        });

        // Resolve all the promises - return the Promise to the calling function
        return Promise.all(requests)
            // .then(results => console.log(JSON.stringify(results, null, 2)))
            .catch(error => {
                throw Error("There is an error attempting to delete all of the documents in some of the databases (Keep Current Settings) ..." + error);       // Throw an error so that the promise returns rejected
        });
       
    } catch(error) {
        console.log(error);
        throw new Error('Error in deleteAllDocumentsInDbsKeepCurrentSettings');
    }
}

export const createDocumentInASingleDocumentDb = (obj, apiEndpoint, dbDescription, documentIdInUsersDb) => {
    // This function is called when the app is reset, or the app is loaded for the first time after the user has registered.
    // The Miscellaneous document in the database is a single document which stores various values required by the app.
    // The SettingsFactors document in the database is a single document which stores the values entered (excluding teams) on the Settings screen.

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
    const numberOfDivisions = TEAMS_DEFAULT.length;
    let division;
    let bulkData = [];
    let i;
    let j;

    for (i = 0; i < numberOfDivisions; i++) {
        division = Object.keys(TEAMS_DEFAULT[i])[0];
        for (j = 0; j < TEAMS_DEFAULT[i][division].length; j++) {
            bulkData.push({
                insertOne: {
                    document: { ...TEAMS_DEFAULT[i][division][j], division, userDocumentId: documentIdInUsersDb }
                }
            });
        }
    }

    try {
        return sendDataToAPIEndpoint(API_ENDPOINT_TEAMS, 'Team', 'POST', bulkData);
    } catch(error) {
        throw new Error('Error creating Team documents in db', error);
    }
}

export const createMyWatchlistTeamsDocumentsInDb = (myWatchlistTeams, documentIdInUsersDb) => {
    // This function is called when the app is reset, or the app is loaded for the first time after the user has registered.
    // The My Watchlist Team documents in the database just store a document for each team with the team's name.
    let bulkData = [];
    let i;

    debugger;
    for (i = 0; i < myWatchlistTeams.length; i++) {
        bulkData.push({
            insertOne: {
                document: {
                    ...myWatchlistTeams[i],
                    userDocumentId: documentIdInUsersDb,
                }
            }
        });
    }

    try {
        return sendDataToAPIEndpoint(API_ENDPOINT_MY_WATCHLIST_TEAMS, 'MyWatchlistTeam', 'POST', bulkData);
    } catch(error) {
        throw new Error('Error creating MyWatchlistTeam documents in db', error);
    }
}

export const createFixturesDocumentsInDb = (fixtures, documentIdInUsersDb) => {
    let bulkData = [];
    let i;

    for (i = 0; i < fixtures.length; i++) {
        bulkData.push({
            insertOne: {
                document: {
                    ...fixtures[i],
                    userDocumentId: documentIdInUsersDb,
                }
            }
        });
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

export const mergeDocumentsIdsFromFixturesDatabaseToObjectsInArray = (originalValues, resultsFromAPICall) => {
    // Add the newly created ids from the documents in the database to the array in memory
   
    let updatedValues = [...originalValues];

    resultsFromAPICall.insertedIds.forEach((objectInArray, i) => {
        updatedValues[i] = Object.assign({}, updatedValues[i], objectInArray);
    });

    return updatedValues;
}

export const updateTeamsDocumentsInDb = (updatedValues) => {
    // This function is called when changes to the teams on the Settings screen are then saved
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

export const updateMyWatchlistTeamsDocumentsInDb = (updatedValues) => {
    // This function is called when changes to the My Watchlist Teams on the Settings screen are then saved
    let bulkData = [];

        updatedValues.forEach(updatedValue => {
            bulkData.push({
                updateOne: {
                    filter: { _id: updatedValue._id },
                    update: updatedValue
                }
            });        
        });

        sendDataToAPIEndpoint(API_ENDPOINT_MY_WATCHLIST_TEAMS, 'MyWatchlistTeam', 'PUT', bulkData);
}

export const deleteMyWatchlistTeamsDocumentsInDb = (deletedValues) => {
    // This function is called when changes to the My Watchlist Teams on the Settings screen are then saved
    let bulkData = [];

    deletedValues.forEach(updatedValue => {
        bulkData.push({
            deleteOne: {
                filter: { userDocumentId: deletedValues[0].userDocumentId, _id: updatedValue._id },
            }
        });        
    });

    sendDataToAPIEndpoint(API_ENDPOINT_MY_WATCHLIST_TEAMS, 'MyWatchlistTeam', 'DELETE', bulkData);
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

export const updateSettingsFactorsDocumentInDb = (settingsFactorsDocumentIdInDb, changes) => {
    return sendDataToAPIEndpoint(API_ENDPOINT_SETTINGS_FACTORS + "/" + settingsFactorsDocumentIdInDb, 'Settings Factors', 'PUT', changes);
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
            const plural = (apiEndpoint === API_ENDPOINT_SETTINGS_FACTORS ? '' : 's');
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