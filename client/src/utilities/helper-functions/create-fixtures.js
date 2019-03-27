import * as helpers from './helpers';
import { DIVISIONS, COMPETITION_ROUNDS } from '../constants';

export function createFixtures(teamsForCompetition, competitionStartDate) {
    let allTeams = [];

    if (teamsForCompetition.length === 5) {        
        teamsForCompetition.forEach((teamsByDivision, i) => {
            allTeams.push(...teamsByDivision[DIVISIONS[i]]);
        });
    }

    return {
        fixtures: createSetOfFixtures(allTeams),
        dateOfSetOfFixtures: competitionStartDate,
        competitionRound: COMPETITION_ROUNDS[0],
        isReplays: false,
    };
}

const createSetOfFixtures = (teamsRemainingInCompetition) => {
    let i;
    let homeTeam;
    let awayTeam;
    let homeTeamDivision;
    let awayTeamDivision;
    let setOfFixtures;
    let teamsStillToBeDrawn;
    let numberOfFixtures;

    setOfFixtures = [];
    teamsStillToBeDrawn = [];
    numberOfFixtures = teamsRemainingInCompetition.length / 2;

    teamsRemainingInCompetition.forEach(teamRemaining => teamsStillToBeDrawn.push(teamRemaining.teamName));       //Put the team names into an array

    for (i = 0; i < numberOfFixtures; i++) {

        homeTeam = teamsStillToBeDrawn[helpers.getRandomNumber(teamsStillToBeDrawn.length)];
        homeTeamDivision = helpers.getDivisionTheTeamPlaysIn(teamsRemainingInCompetition, homeTeam);
        teamsStillToBeDrawn.splice(teamsStillToBeDrawn.indexOf(homeTeam), 1);    //Remove the randomly selected team from the remaining array

        awayTeam = teamsStillToBeDrawn[helpers.getRandomNumber(teamsStillToBeDrawn.length)];
        awayTeamDivision = helpers.getDivisionTheTeamPlaysIn(teamsRemainingInCompetition, awayTeam);
        teamsStillToBeDrawn.splice(teamsStillToBeDrawn.indexOf(awayTeam), 1);    //Remove the randomly selected team from the remaining array

        setOfFixtures.push({ homeTeam: homeTeam, awayTeam: awayTeam, homeTeamDivision: homeTeamDivision, awayTeamDivision: awayTeamDivision, hasFixtureFinished: false })

        // if (i === numberOfFixtures / 2 - 1) teamsDrawn.sort();      //Sort the first half of the teams
    }

    return setOfFixtures;
}

// const getFixturesDate = (date) => {
//     let fixturesDate;
//     let fixturesDateNew;

//     fixturesDate = new Date(date);
//     fixturesDateNew = new Date(fixturesDate);
//     fixturesDateNew.setDate(fixturesDateNew.getDate() + 7);

//     return fixturesDateNew.toDateString();
// }
