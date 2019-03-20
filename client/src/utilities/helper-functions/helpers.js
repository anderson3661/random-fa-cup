import { COMPETITION_ROUNDS, COMPETITION_ROUNDS_FIXTURES, COMPETITION_ROUNDS_HEADINGS, COMPETITION_ROUNDS_HEADINGS_ABBREVIATED, PREMIER_LEAGUE, DIVISIONS, DIVISIONS_ABBREVIATIONS, IS_FIXTURES, IS_REPLAYS } from '../constants';


export const goToTopOfPage = () => {
    window.scrollTo(0, 0);
}

export const getRandomNumber = (nToRandomise) => {
    return Math.floor(Math.random() * nToRandomise);
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

export const getPositionInArrayOfObjects = (array, objectProperty, objectValue) => {
    let i = 0;
    let len;

    for (i = 0, len = array.length; i < len; i++) {
        if (array[i][objectProperty] === objectValue) return i;
    }
    return -1;
}

export const getGoalsPerMinuteFactors = (likelihoodOfAGoalDuringASetPeriod, typeToReturn) => {
    // Goal Factors on the Admin Factors database is an array, but is shown as a string on the Administration screen
    let goalFactorsString;

    if (typeof(likelihoodOfAGoalDuringASetPeriod) === 'string' && typeToReturn === 'array') {
        return JSON.parse(likelihoodOfAGoalDuringASetPeriod.replace(/([a-zA-Z0-9]+?):/g, '"$1":').replace(/'/g,'"'));
    } else if (typeof(likelihoodOfAGoalDuringASetPeriod) !== 'string' && typeToReturn === 'string') {
        goalFactorsString = likelihoodOfAGoalDuringASetPeriod.map(arr => "{minutes: " + arr.minutes + ", factor: " + arr.factor + "}");
        return "[" + goalFactorsString.join(', ') + "]";
    }

    return likelihoodOfAGoalDuringASetPeriod;
}

export const doesObjectHaveAnyProperties = (object) => {
    return Object.keys(object).length > 0;
}

export const getDivisionTheTeamPlaysIn = (teamsRemainingInCompetition, teamName) => {
    const teamInArray = getPositionInArrayOfObjects(teamsRemainingInCompetition, 'teamName', teamName);
    return teamInArray === -1 ? null : teamsRemainingInCompetition[teamInArray].division;
}

export const getCompetitionRoundIndex = (competitionRound) => {
    return COMPETITION_ROUNDS.indexOf(competitionRound);
}

export const getCompetitionRoundHeader = (param) => {
    const dash = param.indexOf('-');
    return (param.substr(0, dash) + " " + param.substr(dash + 1)).toLowerCase().split(' ').map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
}

export const getDivisionAbbreviation = (division) => {
        return division === 'premierLeague' ? null : DIVISIONS_ABBREVIATIONS[DIVISIONS.indexOf(division)];
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

export const isOneOfMyWatchlistTeams = (team, myWatchListTeams) => {
    // Division could be single (e.g. 'Championship') or double (for instance where a replay is due and it will contain for example 'Championship / League One')
    if (team) {
        const slashIndex = team.indexOf('/');
        if (slashIndex === -1 && getPositionInArrayOfObjects(myWatchListTeams, 'teamName', team) !== -1) return true;                             // Single team
        if (slashIndex !== -1 && getPositionInArrayOfObjects(myWatchListTeams, 'teamName', team.substr(0, slashIndex - 1)) !== -1) return true;   // Dual team - check first element of team
        if (slashIndex !== -1 && getPositionInArrayOfObjects(myWatchListTeams, 'teamName', team.substr(slashIndex + 2)) !== -1) return true;      // Dual team - check second element of team
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

export const areAnyPremierLeagueTeamsPlaying = (fixtures) => {
    for (let i = 0; i < fixtures.length; i++) {
        if (containsPremierLeague(fixtures[i].homeTeamDivision) || containsPremierLeague(fixtures[i].awayTeamDivision)) return true;
    }
    return false;
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

export const isThisCompetitionRoundTheFinal = (competitionRound) => {
    return getCompetitionRoundIndex(competitionRound) === COMPETITION_ROUNDS.length - 1;
}

export const getFixturesArray = (fixturesArray, competitionRoundIndex, isReplays) => {
    return fixturesArray[competitionRoundIndex][COMPETITION_ROUNDS_FIXTURES[competitionRoundIndex] + (isReplays ? 'Replays' : 'Fixtures')];
}

export const haveAllFixturesInSetFinished = (fixturesArray) => {
    return fixturesArray.filter(fixture => fixture.hasFixtureFinished).length === fixturesArray.length;
}

const haveZeroFixturesInSetFinished = (fixturesArray) => {
    return fixturesArray.filter(fixture => fixture.hasFixtureFinished).length === 0;
}

export const getObjectKey = (object) => {
    return Object.keys(object)[0];
}

export const getWinningTeamFromFixture = (fixture) => {
    return fixture.homeTeamsScore > fixture.awayTeamsScore ? fixture.homeTeam : fixture.awayTeam;
}

export const getWinningTeamsDivisionFromFixture = (fixture) => {
    return fixture.homeTeamsScore > fixture.awayTeamsScore ? fixture.homeTeamDivision : fixture.awayTeamDivision;
}

export const getWinningTeamInFinal = (fixtures) => {
    return (fixtures[0].homeTeamScore > fixtures[0].awayTeamScore ? fixtures[0].homeTeam : fixtures[0].awayTeam);
}

const isResultADraw = (fixtures) => {
    return (fixtures.homeTeamScore === fixtures.awayTeamScore);
}

export const isCompetitionAtSemiFinalStage = (competitionRoundIndex) => {
    return competitionRoundIndex === COMPETITION_ROUNDS.length - 2;
}

export const isCompetitionAtFinalStage = (competitionRoundIndex) => {
    return competitionRoundIndex === COMPETITION_ROUNDS.length - 1;
}

export const getNextCompetitionRoundForDraw = (fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished) => {
    let i;

    if (!hasCompetitionStarted) return { okToProceedWithDraw: true, competitionRound: COMPETITION_ROUNDS[0] };
    if (!fixturesForCompetition || hasCompetitionFinished) return { okToProceedWithDraw: false, competitionRound: COMPETITION_ROUNDS[0] };

    for (i = 0; i < fixturesForCompetition.length; i++) {
        const fixturesForRound = getFixturesArray(fixturesForCompetition, i, IS_FIXTURES);

        // No fixtures set up so the draw is for 1st Round
        if (i === 0 && fixturesForRound.length === 0) {
            return { okToProceedWithDraw: true, competitionRound: COMPETITION_ROUNDS[i] };
        }

        // If fixtures for this round have not been set up and fixtures for previous round have all finished return draw is for this round
        if (i > 0 && fixturesForRound.length === 0) {                                           
            const fixturesForPreviousRound = getFixturesArray(fixturesForCompetition, i - 1, IS_FIXTURES);
            if (haveAllFixturesInSetFinished(fixturesForPreviousRound)) {
                return { okToProceedWithDraw: true, competitionRound: COMPETITION_ROUNDS[i] };
            } else {
                // Fixtures for previous round haven't started as return null
                return { okToProceedWithDraw: false, competitionRound: COMPETITION_ROUNDS[i] };
            }
        }

        //  If there are 2 semi-final fixtures then don't show the draw for the final as it is unnecessary
        if (isCompetitionAtSemiFinalStage(i) && fixturesForRound.length === 2) return { okToProceedWithDraw: false, competitionRound: COMPETITION_ROUNDS[i] };
    }

    return { okToProceedWithDraw: false };
}

export const getCompetitionRoundForPlay = (fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished) => {
    let fixturesThisRound = [];
    let fixturesNextRound = [];

    if (!fixturesForCompetition || !hasCompetitionStarted || hasCompetitionFinished) return { okToProceedWithPlay: false, label: '' };

    const competitionRoundIndex = getCompetitionRoundIndexForPlay(fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished);
    if (competitionRoundIndex === -1) return { okToProceedWithPlay: false, label: '' };

    fixturesThisRound = getFixturesArray(fixturesForCompetition, competitionRoundIndex, IS_FIXTURES);
    if (fixturesThisRound.length > 0 && haveZeroFixturesInSetFinished(fixturesThisRound)) {
        return { okToProceedWithPlay: true, label: COMPETITION_ROUNDS_HEADINGS[competitionRoundIndex] };
    }

    if (fixturesForCompetition[competitionRoundIndex].replaysAllowed) {
        fixturesThisRound = getFixturesArray(fixturesForCompetition, competitionRoundIndex, IS_REPLAYS);
        if (competitionRoundIndex < COMPETITION_ROUNDS.length - 1) fixturesNextRound = getFixturesArray(fixturesForCompetition, competitionRoundIndex + 1, IS_FIXTURES);
        if (fixturesThisRound.length > 0 && fixturesNextRound.length > 0 && haveZeroFixturesInSetFinished(fixturesThisRound)) {
            return { okToProceedWithPlay: true, label: COMPETITION_ROUNDS_HEADINGS[competitionRoundIndex] + ' Replays'};
        }
    }

    return { okToProceedWithPlay: false, label: '' };
}

export const canLatestFixturesProceed = (fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished) => {
    let fixturesThisRound = [];
    let fixturesNextRound = [];

    if (!fixturesForCompetition || !hasCompetitionStarted || hasCompetitionFinished) return false;

    const competitionRoundIndex = getCompetitionRoundIndexForPlay(fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished);
    if (competitionRoundIndex === -1) return false;

    fixturesThisRound = getFixturesArray(fixturesForCompetition, competitionRoundIndex, IS_FIXTURES);
    if (fixturesThisRound.length > 0 && haveZeroFixturesInSetFinished(fixturesThisRound)) return true;

    if (fixturesForCompetition[competitionRoundIndex].replaysAllowed) {
        fixturesThisRound = getFixturesArray(fixturesForCompetition, competitionRoundIndex, IS_REPLAYS);
        if (competitionRoundIndex < COMPETITION_ROUNDS.length - 1) fixturesNextRound = getFixturesArray(fixturesForCompetition, competitionRoundIndex + 1, IS_FIXTURES);
        if (fixturesThisRound.length > 0 && fixturesNextRound.length > 0 && haveZeroFixturesInSetFinished(fixturesThisRound)) return true;
    }

    return false;
}

const getCompetitionRoundIndexForPlay = (fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished) => {
    // If any round of fixtures has been completed then the draw is for the next round - so work backwards through the loop
    if (!hasCompetitionStarted || hasCompetitionFinished) return -1;

    for (let i = fixturesForCompetition.length - 1; i >= 0; i--) {
        const fixtures = getFixturesArray(fixturesForCompetition, i, IS_FIXTURES);
        if (fixtures.length > 0 && haveZeroFixturesInSetFinished(fixtures)) {
            if (i > 0 && fixturesForCompetition[i - 1].replaysAllowed) {
                const replaysPreviousRound = getFixturesArray(fixturesForCompetition, i - 1, IS_REPLAYS);
                if (replaysPreviousRound.length > 0) {
                    if (haveAllFixturesInSetFinished(replaysPreviousRound)) return i;               // All the replays in the previous round have finished
                    if (haveZeroFixturesInSetFinished(replaysPreviousRound)) return i - 1;          // None of the fixtures in the previous round have finished
                } else {
                    return i;       // There are no replays for the previous round
                }
            } else {
                return i;
            }
        }
        if (fixturesForCompetition[i].replaysAllowed) {
            const replays = getFixturesArray(fixturesForCompetition, i, IS_REPLAYS);
            if (replays.length > 0 && haveZeroFixturesInSetFinished(replays)) return i;
        }
    }
    return -1;        // If there is a round where the fixtures have not all finished (e.g. First round after the draw has just been made, then return null)
}

export const getCompetitionRoundForDrawLabel = (nextCompetitionRoundForDraw) => {
    const competitionRoundsIndex = COMPETITION_ROUNDS.indexOf(nextCompetitionRoundForDraw.competitionRound);
    return competitionRoundsIndex === -1 ? '' : COMPETITION_ROUNDS_HEADINGS_ABBREVIATED[competitionRoundsIndex] + ' Draw';
}

export const getCompetitionRoundForPlayLabel = (competitionRoundForPlay) => {
    // This could have fixtures or replays (in which case the label has 'Replays' added at the end)
    let competitionRound = competitionRoundForPlay.label;
    const replaysIndex = competitionRound.indexOf('Replays');
    if (replaysIndex !== -1) competitionRound = competitionRound.substr(0, replaysIndex - 1);
    const competitionRoundsIndex = COMPETITION_ROUNDS_HEADINGS.indexOf(competitionRound);
    return competitionRoundsIndex === -1 ? '' : 'Play ' + COMPETITION_ROUNDS_HEADINGS_ABBREVIATED[competitionRoundsIndex] + (replaysIndex !== -1 ? " Replays" : "");
}

export const haveAllFixturesAndReplaysForCompetitionRoundFinished = (fixturesForCompetition, competitionRoundIndex) => {
    const fixtures = getFixturesArray(fixturesForCompetition, competitionRoundIndex, IS_FIXTURES);
    if (fixtures.length > 0 && haveAllFixturesInSetFinished(fixtures)) {
        if (fixturesForCompetition[competitionRoundIndex].replaysAllowed) {
            const replays = getFixturesArray(fixturesForCompetition, competitionRoundIndex, IS_REPLAYS);
            if (replays.length > 0 && haveAllFixturesInSetFinished(replays)) return true;
        } else {
            return true;
        }
    }
    return false;
}

export const areReplaysForCompetitionRoundStillToBePlayed = (fixturesForCompetition, competitionRoundIndex) => {
    const fixtures = getFixturesArray(fixturesForCompetition, competitionRoundIndex, IS_FIXTURES);
    if (fixtures.length > 0 && haveAllFixturesInSetFinished(fixtures)) {
        if (fixturesForCompetition[competitionRoundIndex].replaysAllowed) {
            const replays = getFixturesArray(fixturesForCompetition, competitionRoundIndex, IS_REPLAYS);
            if (replays.length > 0 && haveZeroFixturesInSetFinished(replays)) return true;
        }
    }
    return false;
}

export const getFixturesForCompetitionRound = (competitionRound, fixturesForCompetition, isReplays) => {
    const competitionRoundIndex = COMPETITION_ROUNDS.indexOf(competitionRound);
    return fixturesForCompetition[competitionRoundIndex][COMPETITION_ROUNDS_FIXTURES[competitionRoundIndex] + (isReplays ? 'Replays' : 'Fixtures')];
}

export const deepClone = (objectOrArrayToDeepClone) => {
    return JSON.parse(JSON.stringify(objectOrArrayToDeepClone));
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
    let division;
    let i;
    let j;
    let numberOfDivisions;

    if (!fixtures || getFixturesArray(fixtures, 0, IS_FIXTURES).length === 0) {   // fixtures is passed in as null from latest-fixtures, so just return all teams
        
        numberOfDivisions = teams.length;

        for (i = 0; i < numberOfDivisions; i++) {
            division = Object.keys(teams[i])[0];
            for (j = 0; j < teams[i][division].length; j++) {
                teamsToReturn.push({ ...teams[i][division][j], division });
            }
        }

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

export const getTeamsRemainingInCompetitionByDivision = (teams, fixturesForCompetition, competitionRound ) => {
    let teamsToReturn = [];
    let division;
    let i;
    let j;
    let numberOfDivisions;
    let winningTeam;
    let winningTeamsDivision;

    if (!fixturesForCompetition || getFixturesArray(fixturesForCompetition, 0, IS_FIXTURES).length === 0) {   // fixtures is passed in as null from latest-fixtures, so just return all teams
        
        numberOfDivisions = teams.length;

        for (i = 0; i < numberOfDivisions; i++) {
            division = Object.keys(teams[i])[0];
            for (j = 0; j < teams[i][division].length; j++) {
                teamsToReturn.push({ ...teams[i][division][j], division });
            }
        }

    } else {

        const competitionRoundIndex = COMPETITION_ROUNDS.indexOf(competitionRound);

        if (competitionRoundIndex >= 0) {
            const fixtures = getFixturesArray(fixturesForCompetition, competitionRoundIndex, IS_FIXTURES);
            for (i = 0; i < fixtures.length; i++) {
                if (fixtures[i].hasFixtureFinished && !isResultADraw(fixtures[i])) {
                    winningTeam = getWinningTeamFromFixture(fixtures[i]);
                    winningTeamsDivision = getWinningTeamsDivisionFromFixture(fixtures[i]);
                    addTeamToArray(winningTeam, winningTeamsDivision, teamsToReturn);
                } else {
                    addTeamToArray(fixtures[i].homeTeam, fixtures[i].homeTeamDivision, teamsToReturn);
                    addTeamToArray(fixtures[i].awayTeam, fixtures[i].awayTeamDivision, teamsToReturn);
                }
            }
        }

    }

    return teamsToReturn.sort((a, b) => a.teamName > b.teamName ? 1 : -1);
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

export const hasObjectValueChanged = (originalObject, updatedObject, key) => {
    return originalObject[key] !== updatedObject[key];
}

export const haveObjectValuesChanged = (originalObject, updatedObject, key) => {
    // This is the same function as in administration-helpers (function = haveSettingsFactorsValuesChanged) so refactor
    let anyChanges = false;
    const originalValues = originalObject[key];
    const updatedValues = updatedObject[key];
    Object.entries(originalValues).forEach(([key, val]) => {
        if (val !== updatedValues[key]) anyChanges = true;
    });
    return anyChanges;
};

export const getLatestCompetitionRoundIndex = (fixturesForCompetition) => {
    for (let i = fixturesForCompetition.length - 1; i >= 0; i--) {
        if (getFixturesArray(fixturesForCompetition, i, IS_FIXTURES).length > 0) return i;
    };
    return -1;
}

export const getTeamsRemainingForDivision = (teamsRemaining, division) => {
    return teamsRemaining.filter(team => team.division === DIVISIONS[DIVISIONS_ABBREVIATIONS.indexOf(division)]).length;
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
    debugger;
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