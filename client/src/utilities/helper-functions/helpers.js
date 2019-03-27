import { COMPETITION_ROUNDS, COMPETITION_ROUNDS_FIXTURES, COMPETITION_ROUNDS_HEADINGS, COMPETITION_ROUNDS_HEADINGS_ABBREVIATED, COMPETITION_ROUNDS_FOR_CSS,
         PREMIER_LEAGUE, DIVISIONS, DIVISIONS_ABBREVIATIONS, IS_FIXTURES, IS_REPLAYS, FINAL } from '../constants';


export const goToTopOfPage = () => {
    window.scrollTo(0, 0);
}

export const getRandomNumber = (nToRandomise) => {
    return Math.floor(Math.random() * nToRandomise);
}

export const deepClone = (objectOrArrayToDeepClone) => {
    return JSON.parse(JSON.stringify(objectOrArrayToDeepClone));
}

export const scrollDiv = (div) => {
    if (div) div.scrollTop = div.scrollHeight - div.clientHeight;
}

export const getPositionInArrayOfObjects = (array, objectProperty, objectValue) => {
    let i = 0;
    let len;

    for (i = 0, len = array.length; i < len; i++) {
        if (array[i][objectProperty] === objectValue) return i;
    }
    return -1;
}

export const doesObjectHaveAnyProperties = (object) => {
    return Object.keys(object).length > 0;
}

export const getObjectKey = (object) => {
    return Object.keys(object)[0];
}

export const hasObjectValueChanged = (originalObject, updatedObject, key) => {
    return originalObject[key] !== updatedObject[key];
}

export const haveObjectValuesChanged = (originalObject, updatedObject, key) => {
    // This is the same function as in settings-helpers (function = haveSettingsFactorsValuesChanged) so refactor
    let anyChanges = false;
    const originalValues = originalObject[key];
    const updatedValues = updatedObject[key];
    Object.entries(originalValues).forEach(([key, val]) => {
        if (val !== updatedValues[key]) anyChanges = true;
    });
    return anyChanges;
};

export const getFixturesArray = (fixturesArray, competitionRoundIndex, isReplays) => {
    return fixturesArray[competitionRoundIndex][COMPETITION_ROUNDS_FIXTURES[competitionRoundIndex] + (isReplays ? 'Replays' : 'Fixtures')];
}

export const haveAllFixturesInSetFinished = (fixturesArray) => {
    return fixturesArray.filter(fixture => fixture.hasFixtureFinished).length === fixturesArray.length;
}

export const getWinningTeamFromFixture = (fixture, division) => {
    return fixture.homeTeamsScore > fixture.awayTeamsScore ? ('homeTeam' + (division ? 'Division' : '')) :
           (fixture.awayTeamsScore > fixture.homeTeamsScore ? ('awayTeam' + (division ? 'Division' : '')) :
           (fixture.homeTeamsScorePenalties > fixture.awayTeamsScorePenalties ? ('homeTeam' + (division ? 'Division' : '')) : ('awayTeam' + (division ? 'Division' : ''))));
}

export const getWinningTeamsNameFromFixture = (fixture) => {
    return fixture[getWinningTeamFromFixture(fixture)];
}

export const getWinningTeamsDivisionFromFixture = (fixture) => {
    return fixture[getWinningTeamFromFixture(fixture, true)];
}

export const getWinningTeamInFinal = (fixtures) => {
    return fixtures[0][getWinningTeamFromFixture(fixtures[0])];
}

export const getCompetitionRoundIndex = (competitionRound) => {
    return COMPETITION_ROUNDS.indexOf(competitionRound);
}

export const getLatestCompetitionRoundIndex = (fixturesForCompetition) => {
    for (let i = fixturesForCompetition.length - 1; i >= 0; i--) {
        if (getFixturesArray(fixturesForCompetition, i, IS_FIXTURES).length > 0) return i;
    };
    return -1;
}

export const getPreviousCompetitionRound = (competitionRound, haveFixturesForCompetitionRoundBeenPlayed) => {
    const indexDeduction = (competitionRound === FINAL ? (haveFixturesForCompetitionRoundBeenPlayed ? 0 : 1) : haveFixturesForCompetitionRoundBeenPlayed ? 2 : 1);
    return COMPETITION_ROUNDS[Math.max(0, getCompetitionRoundIndex(competitionRound) - indexDeduction)];
}

export const getCompetitionRoundHeader = (param) => {
    const dash = param.indexOf('-');
    return (param.substr(0, dash) + " " + param.substr(dash + 1)).toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}

export const getCompetitionRoundForCSS = (competitionRound) => {
    return COMPETITION_ROUNDS_FOR_CSS[COMPETITION_ROUNDS.indexOf(competitionRound)];
}

export const getCompetitionRoundLabel = (competitionRound, isAbbreviations) => {
    const competitionRoundsIndex = COMPETITION_ROUNDS.indexOf(competitionRound);
    return competitionRoundsIndex === -1 ? '' : (isAbbreviations ? COMPETITION_ROUNDS_HEADINGS_ABBREVIATED[competitionRoundsIndex] : COMPETITION_ROUNDS_HEADINGS[competitionRoundsIndex]);
}

export const getNextCompetitionRound = (competitionRound) => {
    const competitionRoundsIndex = COMPETITION_ROUNDS.indexOf(competitionRound) + 1;
    return competitionRoundsIndex === -1 ? '' : COMPETITION_ROUNDS[competitionRoundsIndex];
}

export const getNextCompetitionRoundLabel = (competitionRound) => {
    const competitionRoundsIndex = COMPETITION_ROUNDS.indexOf(competitionRound) + 1;
    return competitionRoundsIndex === -1 ? '' : COMPETITION_ROUNDS_HEADINGS[competitionRoundsIndex];
}

export const getCompetitionRoundForNextDrawLabel = (competitionRoundForNextDraw) => {
    const competitionRoundsIndex = COMPETITION_ROUNDS.indexOf(competitionRoundForNextDraw);
    return competitionRoundsIndex === -1 ? '' : COMPETITION_ROUNDS_HEADINGS_ABBREVIATED[competitionRoundsIndex] + ' Draw';
}

export const getCompetitionRoundForPlayLabel = (competitionRoundForPlay, haveFixturesForCompetitionRoundBeenPlayed, haveFixturesProducedReplays) => {
    // This could have fixtures or replays (in which case the label has 'Replays' added at the end)
    const competitionRoundsIndex = COMPETITION_ROUNDS.indexOf(competitionRoundForPlay);
    return competitionRoundsIndex === -1 ? '' : 'Play ' + COMPETITION_ROUNDS_HEADINGS_ABBREVIATED[competitionRoundsIndex] + (haveFixturesForCompetitionRoundBeenPlayed && haveFixturesProducedReplays ? " Replays" : "");
}

export const getDivisionTheTeamPlaysIn = (teamsRemainingInCompetition, teamName) => {
    const teamInArray = getPositionInArrayOfObjects(teamsRemainingInCompetition, 'teamName', teamName);
    return teamInArray === -1 ? null : teamsRemainingInCompetition[teamInArray].division;
}

export const getDivisionAbbreviation = (division) => {
    return DIVISIONS_ABBREVIATIONS[DIVISIONS.indexOf(division)];
}

export const getDivisionAbbreviationForFixtureOrDrawRow = (division) => {
        return division === 'premierLeague' ? null : DIVISIONS_ABBREVIATIONS[DIVISIONS.indexOf(division)];
}

export const isCompetitionAtSemiFinalStage = (competitionRoundIndex) => {
    return competitionRoundIndex === COMPETITION_ROUNDS.length - 2;
}

export const isThisCompetitionRoundTheFinal = (competitionRound) => {
    return getCompetitionRoundIndex(competitionRound) === COMPETITION_ROUNDS.length - 1;
}

export const getExtraTimeOrPenaltiesSummary = (fixture) => {
    let resultSummaryToReturn = "";
    const winningTeamsName = getWinningTeamsNameFromFixture(fixture);
    resultSummaryToReturn += winningTeamsName + ' won ';
    if (fixture.isPenalties) {
        resultSummaryToReturn += ` ${getSummaryResultFromFixture(fixture, 'Penalties')} after penalties (${getSummaryResultFromFixture(fixture, 'After90Minutes')} after 90 minutes)`;
    } else if (fixture.isExtraTime) {
        resultSummaryToReturn += ` after extra time (${getSummaryResultFromFixture(fixture, 'After90Minutes')} after 90 minutes)`;
    }
    return resultSummaryToReturn;
}

const getSummaryResultFromFixture = (fixture, key) => {
    const homeTeamsScore = fixture['homeTeamsScore' + key];
    const awayTeamsScore = fixture['awayTeamsScore' + key];
    return homeTeamsScore > awayTeamsScore ? `${homeTeamsScore}-${awayTeamsScore}` : `${awayTeamsScore}-${homeTeamsScore}`;
}


export const updateCompetitionRoundForNextDraw = (competitionRound) => {
    return COMPETITION_ROUNDS[getCompetitionRoundIndex(competitionRound) + 1];
}

export const getGoalsPerMinuteFactors = (likelihoodOfAGoalDuringASetPeriod, typeToReturn) => {
    // Goal Factors on the Settings Factors database is an array, but is shown as a string on the Settings screen
    let goalFactorsString;

    if (typeof(likelihoodOfAGoalDuringASetPeriod) === 'string' && typeToReturn === 'array') {
        return JSON.parse(likelihoodOfAGoalDuringASetPeriod.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'));
    } else if (typeof(likelihoodOfAGoalDuringASetPeriod) !== 'string' && typeToReturn === 'string') {
        goalFactorsString = likelihoodOfAGoalDuringASetPeriod.map(arr => "{minutes: " + arr.minutes + ", factor: " + arr.factor + "}");
        return "[" + goalFactorsString.join(', ') + "]";
    }

    return likelihoodOfAGoalDuringASetPeriod;
}

export const areAnyMyWatchlistTeamsInTheDraw = (teamsToBeDrawn, myWatchlistTeams) => {
    for (let i = 0; i < teamsToBeDrawn.length; i++) {
        for (let j = 0; j < myWatchlistTeams.length; j++) {
            if (containsTeamName(teamsToBeDrawn[i].teamName, myWatchlistTeams[j].teamName)) {
                return true;
            }
        }
    }
    return false;
}

export const areAnyMyWatchlistTeamsPlaying = (fixtures, myWatchlistTeams) => {
    for (let i = 0; i < fixtures.length; i++) {
        for (let j = 0; j < myWatchlistTeams.length; j++) {
            if (containsTeamName(fixtures[i].homeTeam, myWatchlistTeams[j].teamName) || containsTeamName(fixtures[i].awayTeam, myWatchlistTeams[j].teamName)) return true;
        }
    }
    return false;
}

export const areAnyPremierLeagueTeamsPlaying = (fixtures) => {
    for (let i = 0; i < fixtures.length; i++) {
        if (containsPremierLeague(fixtures[i].homeTeamDivision) || containsPremierLeague(fixtures[i].awayTeamDivision)) return true;
    }
    return false;
}

export const containsPremierLeague = (division) => {
    // Division could be single (e.g. 'Championship') or double (for instance where a replay is due and it will contain for example 'Championship / League One')
    if (division) {
        const slashIndex = division.indexOf('/');
        if (slashIndex === -1 && division === PREMIER_LEAGUE) return true;                                  // Single division
        if (slashIndex !== -1 && division.substr(0, slashIndex - 1) === PREMIER_LEAGUE) return true;        // Dual division - check first element of division
        if (slashIndex !== -1 && division.substr(slashIndex + 2) === PREMIER_LEAGUE) return true;           // Dual division - check second element of division
    }
    return false;
}

export const containsTeamName = (teamOrTeams, teamToCheck) => {
    // Team could be single (e.g. 'Brighton') or double (for instance where a replay is due and it will contain for example 'Brighton / Worthing')
    if (teamOrTeams) {
        const slashIndex = teamOrTeams.indexOf('/');
        if (slashIndex === -1 && teamOrTeams === teamToCheck) return true;                                  // Single team
        if (slashIndex !== -1 && teamOrTeams.substr(0, slashIndex - 1) === teamToCheck) return true;        // Dual team - check first element of team
        if (slashIndex !== -1 && teamOrTeams.substr(slashIndex + 2) === teamToCheck) return true;           // Dual team - check second element of team
    }
    return false;
}

export const getFixturesPlayedForTeam = (fixturesForCompetition, teamName, competitionRoundToExclude) => {
    let fixturesPlayed = [];
    for (let i = 0; i < fixturesForCompetition.length; i++) {
        const competitionRound = COMPETITION_ROUNDS[i];
        addToFixturesPlayedForTeam(fixturesForCompetition, i, IS_FIXTURES, teamName, competitionRound, competitionRoundToExclude, fixturesPlayed);
        addToFixturesPlayedForTeam(fixturesForCompetition, i, IS_REPLAYS, teamName, competitionRound, competitionRoundToExclude, fixturesPlayed);
    }
    return fixturesPlayed.reverse();
}

const addToFixturesPlayedForTeam = (fixturesForCompetition, competitionRoundIndex, fixtureType, teamName, competitionRound, competitionRoundToExclude, fixturesPlayed) => {
    if (fixtureType && !fixturesForCompetition[competitionRoundIndex].replaysAllowed) return;       // If replays and replays are not allowed at this stage then return
    const fixturesForCompetitionRound = getFixturesArray(fixturesForCompetition, competitionRoundIndex, fixtureType);
    for (let j = 0; j < fixturesForCompetitionRound.length; j++) {
        if (fixturesForCompetitionRound[j].homeTeam === teamName || fixturesForCompetitionRound[j].awayTeam === teamName) {
            if (competitionRound !== competitionRoundToExclude) {
                fixturesPlayed.push(fixturesForCompetitionRound[j]);
                break;
            }
        }
    }
}

export const isACupUpset = (teamsForCompetition, fixture) => {
    const premierLeagueTeams = teamsForCompetition[0].premierLeague;
    const homeTeamDivisionIndex = DIVISIONS.indexOf(fixture.homeTeamDivision);
    const awayTeamDivisionIndex = DIVISIONS.indexOf(fixture.awayTeamDivision);
    const homeTeamIsInThePremierLeague = fixture.homeTeamDivision === PREMIER_LEAGUE;
    const awayTeamIsInThePremierLeague = fixture.awayTeamDivision === PREMIER_LEAGUE;
    const isHomeTeamWinning = fixture.homeTeamsScore > fixture.awayTeamsScore;
    const isAwayTeamWinning = fixture.awayTeamsScore > fixture.homeTeamsScore;
    const isHomeTeamBeatingAHigherDivisionTeam = isHomeTeamWinning && homeTeamDivisionIndex > awayTeamDivisionIndex;
    const isAwayTeamBeatingAHigherDivisionTeam = isAwayTeamWinning && awayTeamDivisionIndex > homeTeamDivisionIndex;
    const homeTeamIndex = getPositionInArrayOfObjects(premierLeagueTeams, 'teamName', fixture.homeTeam);
    const awayTeamIndex = getPositionInArrayOfObjects(premierLeagueTeams, 'teamName', fixture.awayTeam);
    const isHomeTeamATop6PremierLeagueTeam = (homeTeamIndex === -1 ? false : premierLeagueTeams[homeTeamIndex].isATopTeam);
    const isAwayTeamATop6PremierLeagueTeam = (awayTeamIndex === -1 ? false : premierLeagueTeams[awayTeamIndex].isATopTeam);

    if (Math.abs(homeTeamDivisionIndex - awayTeamDivisionIndex) >= 2 && (isHomeTeamBeatingAHigherDivisionTeam || isAwayTeamBeatingAHigherDivisionTeam)) {
        return true;     // Team in division which is 2 or more higher is losing
    }

    if ((isHomeTeamBeatingAHigherDivisionTeam && awayTeamIsInThePremierLeague) || (isAwayTeamBeatingAHigherDivisionTeam && homeTeamIsInThePremierLeague)) {
        return true;              // Premier League team is losing to a team of a lower division
    }

    if ((isHomeTeamWinning && homeTeamIsInThePremierLeague && awayTeamIsInThePremierLeague && !isHomeTeamATop6PremierLeagueTeam && isAwayTeamATop6PremierLeagueTeam) ||
       (isAwayTeamWinning && homeTeamIsInThePremierLeague && awayTeamIsInThePremierLeague && isHomeTeamATop6PremierLeagueTeam && !isAwayTeamATop6PremierLeagueTeam)) {
        return true;              // One of the top 6 Premier League teams is losing to a non-6 Premier League team
    }

    return false;
}

export const getTeamsForCompetitionFlattened = (teams) => {
    let teamsToReturn = [];
    let division;
    let i;
    let j;
    let numberOfDivisions;

    numberOfDivisions = teams.length;

    for (i = 0; i < numberOfDivisions; i++) {
        division = Object.keys(teams[i])[0];
        for (j = 0; j < teams[i][division].length; j++) {
            teamsToReturn.push({ ...teams[i][division][j], division });
        }
    }

    return teamsToReturn.sort((a, b) => a.teamName > b.teamName ? 1 : -1);
}

export const getTeamsRemainingInCompetitionFlattened = (teams, fixtures, competitionRound) => {
    let teamsToReturn = [];
    let i;

    if (!fixtures || getFixturesArray(fixtures, 0, IS_FIXTURES).length === 0) {   // fixtures is passed in as null from latest-fixtures, so just return all teams

        teamsToReturn = getTeamsForCompetitionFlattened(teams);

    } else {

        const lastCompetitionRoundIndex = COMPETITION_ROUNDS.indexOf(competitionRound) - 1;

        if (lastCompetitionRoundIndex >= 0) {
            const lastCompetitionRoundResults = fixtures[lastCompetitionRoundIndex][COMPETITION_ROUNDS_FIXTURES[lastCompetitionRoundIndex] + 'Fixtures'];
            for (i = 0; i < lastCompetitionRoundResults.length; i++) {
                teamsToReturn.push({
                    teamName: lastCompetitionRoundResults[i].homeTeamsScore > lastCompetitionRoundResults[i].awayTeamsScore ? lastCompetitionRoundResults[i].homeTeam :
                            lastCompetitionRoundResults[i].awayTeamsScore > lastCompetitionRoundResults[i].homeTeamsScore ? lastCompetitionRoundResults[i].awayTeam :
                            lastCompetitionRoundResults[i].homeTeam + " / " + lastCompetitionRoundResults[i].awayTeam,
                    division: lastCompetitionRoundResults[i].homeTeamsScore > lastCompetitionRoundResults[i].awayTeamsScore ? lastCompetitionRoundResults[i].homeTeamDivision :
                            lastCompetitionRoundResults[i].awayTeamsScore > lastCompetitionRoundResults[i].homeTeamsScore ? lastCompetitionRoundResults[i].awayTeamDivision :
                            lastCompetitionRoundResults[i].homeTeamDivision + " / " + lastCompetitionRoundResults[i].awayTeamDivision,
                });
            }
        }

    }

    return teamsToReturn.sort((a, b) => a.teamName > b.teamName ? 1 : -1);
}

export const getTeamsRemainingInCompetitionByDivision = (teamsForCompetition, fixturesForCompetition, competitionRound ) => {
    // teamsRemaining is an array of all all the teams left (i.e. at the start an array of 128 team objects)
    // teamsToReturnByDivision is an array of divisions (i.e. length = 5), with the number of teams in each division left
    let teamsRemaining = [];
    let teamsByDivisionToReturn = [];
    let i;
    let winningTeamsName;
    let winningTeamsDivision;

    const competitionRoundIndex = getCompetitionRoundIndex(competitionRound);

    if (!fixturesForCompetition || getFixturesArray(fixturesForCompetition, competitionRoundIndex, IS_FIXTURES).length === 0) {
        
        // fixturesForCompetition is passed in as null from latest-fixtures, so just return all teams  
        teamsRemaining = getTeamsForCompetitionFlattened(teamsForCompetition);      

    } else {

        if (competitionRoundIndex >= 0) {
            const fixtures = getFixturesArray(fixturesForCompetition, competitionRoundIndex, IS_FIXTURES);
            for (i = 0; i < fixtures.length; i++) {
                if (fixtures[i].hasFixtureFinished && !isResultADraw(fixtures[i])) {
                    winningTeamsName = getWinningTeamsNameFromFixture(fixtures[i]);
                    winningTeamsDivision = getWinningTeamsDivisionFromFixture(fixtures[i]);
                    addTeamToArray(winningTeamsName, winningTeamsDivision, teamsRemaining);
                } else {
                    addTeamToArray(fixtures[i].homeTeam, fixtures[i].homeTeamDivision, teamsRemaining);
                    addTeamToArray(fixtures[i].awayTeam, fixtures[i].awayTeamDivision, teamsRemaining);
                }
            }
        }

    }

    teamsRemaining.sort((a, b) => a.teamName > b.teamName ? 1 : -1);

    DIVISIONS.forEach(division => {
        teamsByDivisionToReturn.push({
            name: division,
            numberOfTeams: teamsRemaining.filter(team => (team.division === division)).length,
        })
    })

    return teamsByDivisionToReturn;
}

const isResultADraw = (fixtures) => {
    return (fixtures.homeTeamsScore === fixtures.awayTeamsScore);
}

const addTeamToArray = (team, division, teamsToReturn) => {
    const slashIndexTeam = team.indexOf('/');
    const slashIndexDivision = division.indexOf('/');
    if (slashIndexTeam === -1) {
        teamsToReturn.push({ teamName: team, division: division });
    } else {
        teamsToReturn.push({ teamName: team.substr(0, slashIndexTeam - 1), division: division.substr(0, slashIndexDivision - 1) });
        teamsToReturn.push({ teamName: team.substr(slashIndexTeam + 2), division: division.substr(slashIndexDivision + 2) });
    }
}

export const formatDate = (dateOfFixtures) => {
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let date = new Date(dateOfFixtures);
    let day = date.getDate();
    let monthIndex = date.getMonth();
    // let year = date.getFullYear();
    let sDaySuffix;

    if (day === 1 || day === 21 || day === 31) {
        sDaySuffix = "st";
    } else if (day === 2 || day === 22) {
        sDaySuffix = "nd";
    } else if (day === 3 || day === 23) {
        sDaySuffix = "rd";
    } else {
        sDaySuffix = "th";
    }

    return dateOfFixtures.substr(0, 4) + day + sDaySuffix + ' ' + monthNames[monthIndex];
}