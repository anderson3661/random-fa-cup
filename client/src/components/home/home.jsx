import React from 'react';
import { connect } from 'react-redux';

import CompetitionRound from './competition-round';
import TeamsLeftByDivision from './teams-left-by-division';
import * as helpers from '../../utilities/helper-functions/helpers';
import { MAIN_BACKGROUND_IMAGE, FA_CUP_IMAGE, COMPETITION_ROUNDS, SEASON } from '../../utilities/constants';

import './home.scss';


// No need for class as component never updates
const Home = (props) => {

    const { authenticated, fixturesForCompetition, hasCompetitionFinished, competitionRoundForNextDraw, competitionRoundForPlay, okToProceedWithDraw,
            haveFixturesForCompetitionRoundBeenPlayed, haveFixturesProducedReplays, teamsRemainingInCompetitionByDivision } = props;

    return (

        <div className="container-home">
            <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>

            <div className="fa-cup-image">
                <img src={FA_CUP_IMAGE} alt=""></img>
            </div>

            {COMPETITION_ROUNDS.map((competitionRound, competitionRoundOfFootballIndex) => {

                let displayPlayReplaysLabel = false, displayPlayFixturesLabel = false, displayPlay = false, displayFixturesAndResultsLabel = false, displayResultsLabel = false, displayFixturesLabel = false, displayFixturesOrResults = false;

                const isCompetitionExpectingDraw = authenticated && okToProceedWithDraw;
                const isCompetitionExpectingToPlayFixtures = authenticated && !haveFixturesForCompetitionRoundBeenPlayed;
                const isCompetitionExpectingToPlayReplays = haveFixturesForCompetitionRoundBeenPlayed && haveFixturesProducedReplays;
                const isCompetitionExpectingToShowReplays = okToProceedWithDraw && haveFixturesForCompetitionRoundBeenPlayed && haveFixturesProducedReplays;

                const competitionRoundForNextDrawIndex = helpers.getCompetitionRoundIndex(competitionRoundForNextDraw);
                const competitionRoundForPlayIndex = helpers.getCompetitionRoundIndex(competitionRoundForPlay);

                const displayDrawLabel = (!hasCompetitionFinished && isCompetitionExpectingDraw && competitionRoundOfFootballIndex === competitionRoundForNextDrawIndex);

                if (!displayDrawLabel) {
                    
                    if (!isCompetitionExpectingDraw) {
                        // Display 'Play Rx Fixtures' or 'Play Rx Replays'
                        displayPlayFixturesLabel = isCompetitionExpectingToPlayFixtures && (competitionRoundOfFootballIndex === competitionRoundForPlayIndex);
                        displayPlayReplaysLabel = isCompetitionExpectingToPlayReplays && (competitionRoundOfFootballIndex === competitionRoundForPlayIndex);
                        displayPlay = displayPlayReplaysLabel || displayPlayFixturesLabel;
                    }
                    
                    if (!displayPlay) {
                        // Display 'Fixtures & Results' or 'Fixtures' or 'Results'
                        displayFixturesAndResultsLabel = isCompetitionExpectingToShowReplays && (competitionRoundOfFootballIndex === competitionRoundForPlayIndex);
                        displayResultsLabel = hasCompetitionFinished || (!displayFixturesAndResultsLabel && competitionRoundOfFootballIndex < competitionRoundForPlayIndex);
                        displayFixturesLabel = (!displayFixturesAndResultsLabel && !displayResultsLabel && competitionRoundOfFootballIndex < competitionRoundForNextDrawIndex);
                        displayFixturesOrResults = displayFixturesAndResultsLabel || displayResultsLabel || displayFixturesLabel;
                    }
                }

                const isCompetitionRoundActive = displayDrawLabel || displayPlay || displayFixturesOrResults;
                const linkTo = displayDrawLabel ? '/draw' : (displayPlay ? '/fixtures-latest' : (displayFixturesOrResults ? '/fixtures-and-results' : ""));
                
                if (competitionRoundOfFootballIndex === 5) {
                    debugger;
                }

                return(
                    <CompetitionRound
                        key={competitionRoundOfFootballIndex}
                        linkTo={linkTo}
                        competitionRoundOfFootball={competitionRound}
                        isCompetitionRoundActive={isCompetitionRoundActive}
                        displayDrawLabel={displayDrawLabel}
                        displayPlayReplaysLabel={displayPlayReplaysLabel}
                        displayPlayFixturesLabel={displayPlayFixturesLabel}
                        displayResultsLabel={displayResultsLabel}
                        displayFixturesLabel={displayFixturesLabel}
                        displayFixturesAndResultsLabel={displayFixturesAndResultsLabel}
                    />
                )

            })}

            {authenticated && !hasCompetitionFinished && <TeamsLeftByDivision teamsRemainingInCompetitionByDivision={teamsRemainingInCompetitionByDivision} />}

            {hasCompetitionFinished &&
                <div className="container-card display-winners">
                    <p className="heading">{`${props.settingsFactors[SEASON]} Winners`}</p>
                    <p className="winners">{helpers.getWinningTeamInFinal(fixturesForCompetition[fixturesForCompetition.length - 1].finalFixtures)}</p>
                </div>
            }
            
        </div>
    );
}
 
const mapStateToProps = (state) => {
    const { authenticated } = state.default.user;
    const { hasCompetitionFinished, competitionRoundForNextDraw, competitionRoundForPlay, okToProceedWithDraw, haveFixturesForCompetitionRoundBeenPlayed, haveFixturesProducedReplays } = state.default.miscellaneous;
    const { teamsForCompetition, fixturesForCompetition, settingsFactors } = state.default;

    return {
        authenticated,
        teamsForCompetition: teamsForCompetition,
        fixturesForCompetition: fixturesForCompetition,
        settingsFactors: settingsFactors,
        hasCompetitionFinished,
        competitionRoundForNextDraw,
        competitionRoundForPlay,
        okToProceedWithDraw,
        haveFixturesForCompetitionRoundBeenPlayed,
        haveFixturesProducedReplays,
        teamsRemainingInCompetitionByDivision: helpers.getTeamsRemainingInCompetitionByDivision(teamsForCompetition, fixturesForCompetition, helpers.getPreviousCompetitionRound(competitionRoundForNextDraw)),
    }
}

export default connect(mapStateToProps, null)(Home);
