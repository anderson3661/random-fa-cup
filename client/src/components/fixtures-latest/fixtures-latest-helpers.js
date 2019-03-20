import { COMPETITION_ROUNDS, COMPETITION_ROUNDS_FIXTURES, IS_FIXTURES } from '../../utilities/constants';
import * as helpers from '../../utilities/helper-functions/helpers';
import { updateDbsAndStoreAfterLatestResults } from '../../redux/actions/fixturesActions';

export const getMaximumMinutes = (fixture, maxMinutesForPeriod) => {
    return Math.max(maxMinutesForPeriod, fixture.maxNumberOfMinutes - fixture.minutesPlayed + 1);    //Add 1 to fixture value
}

export const getNextSetOfFixtures = (fixturesForCompetition) => {
    let fixtures;
    let fixturesPreviousRound;
    let replays;
    let replaysPreviousRound;

    for (let i = 0; i < COMPETITION_ROUNDS_FIXTURES.length; i++) {

        fixtures = [...fixturesForCompetition[i][COMPETITION_ROUNDS_FIXTURES[i] + 'Fixtures']];

        if (fixtures.length > 0 && fixtures.filter(fixture => !fixture.hasFixtureFinished && !fixture.isReplay).length > 0) {
            return {fixtures: [...fixtures], competitionRound: COMPETITION_ROUNDS[i]};          // Fixtures have been created but not started
        }

        if (fixturesForCompetition[i].replaysAllowed) {
            replays = [...fixturesForCompetition[i][COMPETITION_ROUNDS_FIXTURES[i] + 'Replays']];

            if (replays.length > 0 && replays.filter(fixture => !fixture.hasFixtureFinished).length > 0) {
                return {fixtures: [...replays], competitionRound: COMPETITION_ROUNDS[i]};      // Replays are created but have not started
            }
        }

        if (fixtures.length === 0) {
            debugger;
            fixturesPreviousRound = [...fixturesForCompetition[i - 1][COMPETITION_ROUNDS_FIXTURES[i - 1] + 'Fixtures']];
            replaysPreviousRound = (fixturesForCompetition[i].replaysAllowed ? [...fixturesForCompetition[i - 1][COMPETITION_ROUNDS_FIXTURES[i - 1] + 'Replays']] : []);

            if (fixturesPreviousRound.length > 0 && fixturesPreviousRound.filter(fixture => fixture.hasFixtureFinished).length === fixturesPreviousRound.length && replaysPreviousRound.length === 0) {
                return {fixtures: [], competitionRound: COMPETITION_ROUNDS[i]};          // Fixtures have not been created (via Draw) and previous round has finished and there are no replays
            }
        }
    }

    return getEmptySetOfFixtures();
}

export const getEmptySetOfFixtures = () => {
    return { fixtures: [] };
}

export const createUpdatesAfterFixturesHaveFinished = (dispatch, fixturesForCompetition, fixtures, competitionRound) => {
    let i;
    let nextSetOfFixtures = [];

    const replays = [];
    const replayUpdatesInFixturesDb = [];
    const finalFixture = [];

    const competitionRoundIndex = helpers.getCompetitionRoundIndex(competitionRound);

    debugger;
    if (!fixtures[0].isReplay) {

        // These are NOT replays, so if any of the fixtures are drawn then create the replay fixtures (but no replays are allowed in the semi-final or final)
        if (fixturesForCompetition[competitionRoundIndex].replaysAllowed) {
            for (i = 0; i < fixtures.length; i++) {
                if (fixtures[i].homeTeamsScore === fixtures[i].awayTeamsScore) {
                    replays.push({
                        competitionRound: fixtures[i].competitionRound,
                        homeTeam: fixtures[i].awayTeam,
                        awayTeam: fixtures[i].homeTeam,
                        homeTeamDivision: fixtures[i].awayTeamDivision,
                        awayTeamDivision: fixtures[i].homeTeamDivision,
                        dateOfFixture: fixtures[i].dateOfFixture,
                        timeOfFixture: fixtures[i].timeOfFixture,
                        hasFixtureFinished: false,
                        isReplay: true,
                    });
                }
            }
        }
    } else {
        // These are replays so need to update the fixtures database with the scores and also clarify the draw for the next round
        // The replayUpdatesInFixturesDb array is used to update the draw for the next round
        debugger;
        nextSetOfFixtures = [...helpers.getFixturesArray(fixturesForCompetition, competitionRoundIndex + 1, IS_FIXTURES)];
        // nextSetOfFixtures = [...this.props.fixturesForCompetition[nextCompetitionRoundIndex][COMPETITION_ROUNDS_FIXTURES[nextCompetitionRoundIndex] + 'Fixtures']];
        for (i = 0; i < nextSetOfFixtures.length; i++) {
            const updatesToNextRound = {};
            // const updatedObject = { _id: nextSetOfFixtures[nextCompetitionRoundElementNumber]._id };
            const slashHome = nextSetOfFixtures[i].homeTeam.indexOf('/');
            const slashAway = nextSetOfFixtures[i].awayTeam.indexOf('/');
            if (slashHome !== -1 || slashAway !== -1) updatesToNextRound._id = nextSetOfFixtures[i]._id;
            updateTeamsAfterReplay(nextSetOfFixtures, fixtures, i, 'homeTeam', slashHome, updatesToNextRound);
            updateTeamsAfterReplay(nextSetOfFixtures, fixtures, i, 'awayTeam', slashAway, updatesToNextRound);
            if (helpers.doesObjectHaveAnyProperties(updatesToNextRound)) replayUpdatesInFixturesDb.push(updatesToNextRound);
        }
    }

    // If the competition is at the semi-final stage then need to create a fixture for the final as there obviously isn't a draw
    if (helpers.isCompetitionAtSemiFinalStage(competitionRoundIndex)) {
        debugger;
        const semiFinal1WinningTeam = helpers.getWinningTeamFromFixture(fixtures[0]);
        const semiFinal2WinningTeam = helpers.getWinningTeamFromFixture(fixtures[1]);
        const semiFinal1WinningTeamsDivision = helpers.getWinningTeamsDivisionFromFixture(fixtures[0]);
        const semiFinal2WinningTeamsDivision = helpers.getWinningTeamsDivisionFromFixture(fixtures[1]);
        finalFixture.push({
            competitionRound: COMPETITION_ROUNDS[competitionRoundIndex + 1],
            homeTeam: semiFinal1WinningTeam,
            awayTeam: semiFinal2WinningTeam,
            homeTeamDivision: semiFinal1WinningTeamsDivision,
            awayTeamDivision: semiFinal2WinningTeamsDivision,
            dateOfFixture: fixtures[0].dateOfFixture,
            timeOfFixture: fixtures[0].timeOfFixture,
            hasFixtureFinished: false,
            isReplay: false,
        });
    }
    
    dispatch(updateDbsAndStoreAfterLatestResults(fixtures, replays, replayUpdatesInFixturesDb, nextSetOfFixtures, finalFixture));

}

const updateTeamsAfterReplay = (fixturesForNextRound, replays, fixtureCounter, whichTeam, slashIndex, updatesToNextRound, ) => {
    if (slashIndex !== -1) {
        const searchString = (whichTeam === 'homeTeam' ? fixturesForNextRound[fixtureCounter][whichTeam].substr(slashIndex + 2) : fixturesForNextRound[fixtureCounter][whichTeam].substr(0, slashIndex - 1));
        const replaysElementNumber = helpers.getPositionInArrayOfObjects(replays, whichTeam, searchString);
        if (replaysElementNumber !== -1) {
            const winningTeam = (replays[replaysElementNumber].homeTeamsScore > replays[replaysElementNumber].awayTeamsScore ? 'homeTeam' : 'awayTeam');
            updatesToNextRound[whichTeam] = replays[replaysElementNumber][winningTeam];
            updatesToNextRound[whichTeam + 'Division'] = replays[replaysElementNumber][winningTeam + 'Division'];
            fixturesForNextRound[fixtureCounter][whichTeam] = replays[replaysElementNumber][winningTeam];
            fixturesForNextRound[fixtureCounter][whichTeam + 'Division'] = replays[replaysElementNumber][winningTeam + 'Division'];
        }
    }
}
