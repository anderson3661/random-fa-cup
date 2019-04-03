import { COMPETITION_ROUNDS, IS_FIXTURES } from '../../utilities/constants';
import * as helpers from '../../utilities/helper-functions/helpers';
import { updateDbsAndStoreAfterLatestResults } from '../../redux/actions/fixturesActions';

export const getMaximumMinutes = (fixture, maxMinutesForPeriod) => {
    if (fixture.isPenalties) return 100;        //If penalties set the update to 100 minutes
    return Math.max(maxMinutesForPeriod, fixture.maxNumberOfMinutes - fixture.minutesPlayed + 1);    //Add 1 to fixture value
}

export const getSetOfFixturesForCompetitionRound = (fixturesForCompetition, competitionRound, haveFixturesForCompetitionRoundBeenPlayed, haveFixturesProducedReplays) => {
    return helpers.getFixturesArray(fixturesForCompetition, helpers.getCompetitionRoundIndex(competitionRound), haveFixturesForCompetitionRoundBeenPlayed && haveFixturesProducedReplays);
}

export const getEmptySetOfFixtures = () => {
    return { fixtures: [] };
}

export const createUpdatesAfterFixturesHaveFinished = (dispatch, fixturesForCompetition, fixtures, competitionRound, competitionRoundForPlay) => {
    // If haveFixturesForCompetitionRoundBeenPlayed is true then replays are due to be played (if any)
    let i;
    let replaysJustFinished = false;
    let nextSetOfFixtures = [];
    let miscellaneousUpdates = {};

    const replays = [];
    const replayUpdatesInFixturesDb = [];
    const finalFixture = [];

    const competitionRoundIndex = helpers.getCompetitionRoundIndex(competitionRound);
    const nextCompetitionRoundForPlay = helpers.getNextCompetitionRound(competitionRoundForPlay);

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
            if (replays.length > 0) {
                miscellaneousUpdates = { okToProceedWithDraw: true, haveFixturesForCompetitionRoundBeenPlayed: true, haveFixturesProducedReplays: true };
            } else {
                miscellaneousUpdates = { competitionRoundForPlay: nextCompetitionRoundForPlay,
                                         okToProceedWithDraw: true, haveFixturesForCompetitionRoundBeenPlayed: false, haveFixturesProducedReplays: false };
            }
        } else {
            miscellaneousUpdates = { competitionRoundForPlay: nextCompetitionRoundForPlay, okToProceedWithDraw: true, haveFixturesForCompetitionRoundBeenPlayed: false, haveFixturesProducedReplays: false };
        }
    } else {
        // These are replays so need to update the fixtures database with the scores and also clarify the draw for the next round
        // The replayUpdatesInFixturesDb array is used to update the draw for the next round
        nextSetOfFixtures = [...helpers.getFixturesArray(fixturesForCompetition, competitionRoundIndex + 1, IS_FIXTURES)];
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
        miscellaneousUpdates = { competitionRoundForPlay: nextCompetitionRoundForPlay, okToProceedWithDraw: false,
                                 haveFixturesForCompetitionRoundBeenPlayed: false, haveFixturesProducedReplays: false };
               
        replaysJustFinished = true;
    }

    // If the competition is at the semi-final stage then need to create a fixture for the final as there obviously isn't a draw
    if (helpers.isCompetitionAtSemiFinalStage(competitionRoundIndex)) {
        const semiFinal1WinningTeamsName = helpers.getWinningTeamsNameFromFixture(fixtures[0]);
        const semiFinal2WinningTeamsName = helpers.getWinningTeamsNameFromFixture(fixtures[1]);
        const semiFinal1WinningTeamsDivision = helpers.getWinningTeamsDivisionFromFixture(fixtures[0]);
        const semiFinal2WinningTeamsDivision = helpers.getWinningTeamsDivisionFromFixture(fixtures[1]);
        finalFixture.push({
            competitionRound: COMPETITION_ROUNDS[competitionRoundIndex + 1],
            homeTeam: semiFinal1WinningTeamsName,
            awayTeam: semiFinal2WinningTeamsName,
            homeTeamDivision: semiFinal1WinningTeamsDivision,
            awayTeamDivision: semiFinal2WinningTeamsDivision,
            dateOfFixture: fixtures[0].dateOfFixture,
            timeOfFixture: fixtures[0].timeOfFixture,
            hasFixtureFinished: false,
            isReplay: false,
        });
        miscellaneousUpdates = { competitionRoundForPlay: nextCompetitionRoundForPlay, okToProceedWithDraw: false, haveFixturesForCompetitionRoundBeenPlayed: false, haveFixturesProducedReplays: false };
    }
    
    dispatch(updateDbsAndStoreAfterLatestResults(fixtures, replays, replayUpdatesInFixturesDb, nextSetOfFixtures, finalFixture, miscellaneousUpdates, replaysJustFinished));

}

const updateTeamsAfterReplay = (fixturesForNextRound, replays, fixtureCounter, whichTeam, slashIndex, updatesToNextRound, ) => {
    if (slashIndex !== -1) {
        const searchString = (whichTeam === 'homeTeam' ? fixturesForNextRound[fixtureCounter][whichTeam].substr(slashIndex + 2) : fixturesForNextRound[fixtureCounter][whichTeam].substr(0, slashIndex - 1));
        const replaysElementNumber = helpers.getPositionInArrayOfObjects(replays, whichTeam, searchString);
        if (replaysElementNumber !== -1) {

            const winningTeam = (replays[replaysElementNumber].homeTeamsScore > replays[replaysElementNumber].awayTeamsScore ? 'homeTeam' :
                                 (replays[replaysElementNumber].awayTeamsScore > replays[replaysElementNumber].homeTeamsScore ? 'awayTeam' :
                                 (replays[replaysElementNumber].homeTeamsScorePenalties > replays[replaysElementNumber].awayTeamsScorePenalties ? 'homeTeam' : 'awayTeam')));

            updatesToNextRound[whichTeam] = replays[replaysElementNumber][winningTeam];
            updatesToNextRound[whichTeam + 'Division'] = replays[replaysElementNumber][winningTeam + 'Division'];

            fixturesForNextRound[fixtureCounter][whichTeam] = replays[replaysElementNumber][winningTeam];
            fixturesForNextRound[fixtureCounter][whichTeam + 'Division'] = replays[replaysElementNumber][winningTeam + 'Division'];
        }
    }
}
