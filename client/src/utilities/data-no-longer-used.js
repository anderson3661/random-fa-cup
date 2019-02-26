function getAppData() {
    let appData = {};
    let confirmationMessage = "";
    let appDataFromLocalStorage = "";

    if (typeof (Storage) !== "undefined") {

        // localStorage.removeItem(APP_DATA_LOCAL_STORAGE);     //Use to clear file on Firebase if necessary, especially if object has new properties

        appDataFromLocalStorage = localStorage.getItem(APP_DATA_LOCAL_STORAGE);

        if (appDataFromLocalStorage === null) {

            setAppData(appData, true);

        } else {

            appData = JSON.parse(appDataFromLocalStorage);

            if (appData.miscInfo.season === null) {
                confirmationMessage = "Cannot continue ... 'Season' property is blank in local storage item " + APP_DATA_LOCAL_STORAGE;
            } else {
                expandSeasonValue(appData);
            }
        }

    } else {
        confirmationMessage = "Sorry ... cannot use this application because your browser doesn't support local storage";
    }

    return {appData: appData, confirmationMessage}

}

function saveAppData(appData, confirmSaveMessage = false) {
    contractSeasonValue(appData);
    localStorage.setItem(APP_DATA_LOCAL_STORAGE, JSON.stringify(appData));
    expandSeasonValue(appData);
    return confirmSaveMessage ? "Changes saved" : "";
}

function expandSeasonValue(appData) {
    let season = appData.miscInfo.season;
    appData.miscInfo.season = '20' + season.substring(0, 2) + "/" + season.substring(4, 2);    //Change this season format from 1718 to 2017/18        
}

function contractSeasonValue(appData) {
    let season = appData.miscInfo.season;
    if (season !== "") {
        appData.miscInfo.season = season.substring(2, 4) + season.substring(5);     //Change from 2017/18 to 1718 format
    }
}

function deleteFromLocalStorage() {
    localStorage.removeItem(APP_DATA_LOCAL_STORAGE);
    // getAppData();
}

const resetAllDataInDb = () => {
    resetDataInDbAdminFactors("DELETE", API_ENDPOINT_ADMIN_FACTORS);
    resetDataInDbTeams("DELETE", API_ENDPOINT_TEAMS);
    resetDataInDbFixtures("DELETE", API_ENDPOINT_FIXTURES);
    resetDataInDbTable("DELETE", API_ENDPOINT_TABLE);
}

const createDefaultDataInDb = (appDataNew) => {
    resetDataInDbAdminFactors("POST", API_ENDPOINT_ADMIN_FACTORS, appDataNew);
    resetDataInDbTeams("POST", API_ENDPOINT_TEAMS, appDataNew);
    resetDataInDbTable("POST", API_ENDPOINT_TABLE, appDataNew);
}


function resetDataInDbAdminFactors(type, endPoint, appDataNew) {
    
    if (type === "GET") {
        axios.get(endPoint)
        .then(res => { console.log(res.data); return res.data; })
        .catch(err => console.log(`Error on GET ${endPoint}`, err))
    } else if (type === "POST") {
        axios.post(endPoint, getMiscInfo())
        .then(res => { console.log(res.data); appDataNew.miscInfo = res.data; console.log(appDataNew); return res.data; })
            .catch(err => console.log(`Error on POST ${endPoint}`, err))
    } else if (type === "DELETE") {
        axios.delete(endPoint)
            .then(res => { console.log(res.data); return res.data; })
            .catch(err => console.log(`Error on DELETE ${endPoint}`, err))
        }
}

function resetDataInDbTeams(type, endPoint, appDataNew) {
    
    if (type === "GET") {
        axios.get(endPoint)
        .then(res => { console.log(res.data); return res.data; })
        .catch(err => console.log(`Error on GET ${endPoint}`, err))
    } else if (type === "POST") {
        TEAMS_DEFAULT.forEach(item => {
            axios.post(endPoint, item)
            .then(res => { console.log(res.data); appDataNew.teamsForSeason.push(res.data); console.log(appDataNew); return res.data; })
            .catch(err => console.log(`Error on POST ${endPoint}`, err))
        })
    } else if (type === "DELETE") {
        axios.delete(endPoint)
        .then(res => { console.log(res.data); return res.data; })
        .catch(err => console.log(`Error on DELETE ${endPoint}`, err))
    }
}

function resetDataInDbFixtures(type, endPoint, appDataNew) {

    if (type === "GET") {
        axios.get(endPoint)
            .then(res => { console.log(res.data); return res.data; })
            .catch(err => console.log(`Error on GET ${endPoint}`, err))
    } else if (type === "POST") {
        TEAMS_DEFAULT.forEach(team => {
            axios.post(endPoint, getTeamInTable(team.teamName))
            .then(res => { console.log(res.data); return res.data; })
            .catch(err => console.log(`Error on POST ${endPoint}`, err))
        })
    } else if (type === "DELETE") {
        axios.delete(endPoint)
            .then(res => { console.log(res.data); return res.data; })
            .catch(err => console.log(`Error on DELETE ${endPoint}`, err))
    }
}

function resetDataInDbTable(type, endPoint, appDataNew) {

    if (type === "GET") {
        axios.get(endPoint)
            .then(res => { console.log(res.data); return res.data; })
            .catch(err => console.log(`Error on GET ${endPoint}`, err))
    } else if (type === "POST") {
        TEAMS_DEFAULT.forEach(team => {
            axios.post(endPoint, getTeamInTable(team.teamName))
            .then(res => { console.log(res.data); appDataNew.latestTable.push(res.data); console.log(appDataNew); return res.data; })
            .catch(err => console.log(`Error on POST ${endPoint}`, err))
        })
    } else if (type === "DELETE") {
        axios.delete(endPoint)
            .then(res => { console.log(res.data); return res.data; })
            .catch(err => console.log(`Error on DELETE ${endPoint}`, err))
    }
}

// export const saveResultsOfSetOfFixturesToDb = (setOfFixtures) => {
//     debugger;
//     for (let i = 0; i <= 0; i++) {
//     // for (let i = 0; i < setOfFixtures.length; i++) {
//         fetch(API_ENDPOINT_FIXTURES + "/" + setOfFixtures[i]._id, {
//             method: 'PUT', // or 'POST/PATCH'
//             // body: JSON.stringify(data.setsOfFixtures[i].fixtures[j]), // data can be `string` or {object}!
//             body: JSON.stringify(setOfFixtures[i]), // data can be `string` or {object}!
//             headers: {
//             'Content-Type': 'application/json'
//             }
//         }).then(res => res.json())
//         .then(response => console.log('Success:', JSON.stringify(response)))
//         .catch(error => console.error('Error:', error))
//     }
// }

// export const saveTeamsToDb = (originalValues, newValues) => {
//     if (originalValues.length === newValues.length) {
//         for (let i = 0; i < originalValues.length; i++) {
//             if (originalValues[i].teamName !== newValues[i].teamName || originalValues[i].isATopTeam !== newValues[i].isATopTeam) {
//                 fetch(API_ENDPOINT_TEAMS + "/" + newValues[i]._id, {
//                     method: 'PUT', // or 'PATCH'
//                     body: JSON.stringify(newValues[i]), // data can be `string` or {object}!
//                     headers: {
//                       'Content-Type': 'application/json'
//                     }
//                 }).then(res => res.json())
//                 .then(response => console.log('Success:', JSON.stringify(response)))
//                 .catch(error => console.error('Error:', error));
//             }
//         }
//     }
// }

// export async function dataResetApp(dispatch) {
    // This is called by Reset App in Administration
    // It loads the app defaults into memory and then deletes all documents in all databases, and then creates the default documents in all databases
    
    // try {
    //     let appData = await getAppDataDefaults();
    //     await deleteAllDocumentsInAllDbs();
    //     await createDocumentsFromAppDefaultsInDbs(appData)
    //         .then(() => console.log('resolved'))
    //         .catch(() => console.log('rejected'))
    //     return Promise.resolve(appData);
    // } catch(err) {
    //     console.log('Error from resetAppData', err);
    //     return Promise.reject();
    // }
// }

// REDUX ACTION CREATION
// export const adminCreateDocumentsInDbsForFirstTime = (data) => {
//     return function(dispatch) {
//         return dataCreateDocumentsInDbsForFirstTime()
//         .then((data) => dispatch({ type: ADMIN_CREATE_DOCUMENTS_IN_DBS_FOR_FIRST_TIME, data }))
//         .then(() => dispatch(appLoading({loading: false})))
//         .catch(err => console.log('Error ... creating documents in databases for first time', err))
//     }
// }

// return function(dispatch) {
//     return dataResetApp()
//     .then((data) => dispatch(adminReset(data)))
//     .catch(err => console.log('Error ... resetting app', err))
// }

 // Promise.all([
        //     fetch(API_ENDPOINT_ADMIN_FACTORS, { method: 'DELETE' }),
        //     fetch(API_ENDPOINT_TEAMS, { method: 'DELETE' }),
        //     fetch(API_ENDPOINT_FIXTURES, { method: 'DELETE2' }),
        //     fetch(API_ENDPOINT_TABLE, { method: 'DELETE' })
        // ])
        // .then(() => console.log('Documents in all databases deleted'))
        // .catch(() => console.log('Error deleting documents in all databases'))

        // res = await fetch(API_ENDPOINT_ADMIN_FACTORS, { method: 'DELETE' });
        // if (!res.ok) throw Error(res.statusText);


// export const adminCreateFixtures = (data, changes) => {
//     debugger;
//     return function(dispatch) {
//         Promise.all([
//             dataUpdateAdminFactorsDocumentInDb(data, changes),
//             dataCreateFixturesDocumentsInDb(data),
//         ])
//         .then(() => {
//             dispatch(() => {
//                 return {
//                     type: ADMIN_CREATE_FIXTURES,
//                     data
//                 }
//             })
//         })
//         .catch(() => console.log('Error ... create fixtures'))
//     }
// }

// export async function dataCreateDocumentsInDbsForFirstTime() {
//     // This is called when the app is loaded by a user for the first time
//     // It loads the app defaults into memory and then deletes all documents in all databases, and then creates the default documents in all databases
//     debugger;
//     try {
//         let appData = await getAppDataDefaults();
//         await createDocumentsFromAppDefaultsInDbs(appData)
//         return Promise.resolve(appData);
//     } catch(err) {
//         console.log('Error from dataCreateDocumentsInDbsForFirstTime', err);
//         return Promise.reject();
//     }
// }
