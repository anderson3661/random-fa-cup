import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CompetitionFinishedOrWrongStage from '../common/competition-finished-or-wrong-stage';
import CompetitionRound from './competition-round';
import TeamsLeftByDivision from './teams-left-by-division';
import * as helpers from '../../utilities/helper-functions/helpers';
import { MAIN_BACKGROUND_IMAGE, FA_CUP_IMAGE, COMPETITION_ROUNDS, SEASON } from '../../utilities/constants';

import './home.scss';


// No need for class as component never updates
const Home = (props) => {

    const { authenticated, fixturesForCompetition, hasCompetitionFinished, competitionRoundForNextDraw, competitionRoundForPlay, okToProceedWithDraw,
            haveFixturesForCompetitionRoundBeenPlayed, haveFixturesProducedReplays, teamsRemainingInCompetitionByDivision, settingsFactors } = props;

    return (

        <div className="container-home">

            <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>

            <div className="fa-cup-image">
                <img src={FA_CUP_IMAGE} alt=""></img>
            </div>

            {!authenticated &&
                <CompetitionFinishedOrWrongStage
                    authenticated={authenticated}
                    hasCompetitionFinished={false}
                    displayHeader="Log in"
                    isHomeNav={true}
                />
            }

            {COMPETITION_ROUNDS.map((competitionRound, competitionRoundOfLinkIndex) => {

                let displayPlayReplaysLabel = false, displayPlayFixturesLabel = false, displayPlay = false, displayFixturesAndResultsLabel = false, displayResultsLabel = false, displayFixturesLabel = false, displayFixturesOrResults = false;

                const isCompetitionExpectingDraw = authenticated && okToProceedWithDraw;
                const isCompetitionExpectingToPlayFixtures = authenticated && !haveFixturesForCompetitionRoundBeenPlayed;
                const isCompetitionExpectingToPlayReplays = haveFixturesForCompetitionRoundBeenPlayed && haveFixturesProducedReplays;
                const isCompetitionExpectingToShowReplays = okToProceedWithDraw && haveFixturesForCompetitionRoundBeenPlayed && haveFixturesProducedReplays;

                const competitionRoundForNextDrawIndex = helpers.getCompetitionRoundIndex(competitionRoundForNextDraw);
                const competitionRoundForPlayIndex = helpers.getCompetitionRoundIndex(competitionRoundForPlay);

                const displayDrawLabel = (!hasCompetitionFinished && isCompetitionExpectingDraw && competitionRoundOfLinkIndex === competitionRoundForNextDrawIndex);

                if (!displayDrawLabel) {
                    
                    if (!isCompetitionExpectingDraw) {
                        // Display 'Play Rx Fixtures' or 'Play Rx Replays'
                        displayPlayFixturesLabel = isCompetitionExpectingToPlayFixtures && (competitionRoundOfLinkIndex === competitionRoundForPlayIndex);
                        displayPlayReplaysLabel = isCompetitionExpectingToPlayReplays && (competitionRoundOfLinkIndex === competitionRoundForPlayIndex);
                        displayPlay = displayPlayReplaysLabel || displayPlayFixturesLabel;
                    }
                    
                    if (!displayPlay) {
                        // Display 'Fixtures & Results' or 'Fixtures' or 'Results'
                        displayFixturesAndResultsLabel = isCompetitionExpectingToShowReplays && (competitionRoundOfLinkIndex === competitionRoundForPlayIndex);
                        displayResultsLabel = hasCompetitionFinished || (!displayFixturesAndResultsLabel && competitionRoundOfLinkIndex < competitionRoundForPlayIndex);
                        displayFixturesLabel = (!displayFixturesAndResultsLabel && !displayResultsLabel && competitionRoundOfLinkIndex < competitionRoundForNextDrawIndex);
                        displayFixturesOrResults = displayFixturesAndResultsLabel || displayResultsLabel || displayFixturesLabel;
                    }
                }

                const isCompetitionRoundActive = displayDrawLabel || displayPlay || displayFixturesOrResults;
                const linkTo = displayDrawLabel ? '/draw' : (displayPlay ? '/fixtures-latest' : (displayFixturesOrResults ? `/fixtures-and-results/${competitionRound}` : ""));
                
                if (competitionRoundOfLinkIndex === 5) {
                    debugger;
                }

                return(
                    <CompetitionRound
                        key={competitionRoundOfLinkIndex}
                        linkTo={linkTo}
                        competitionRoundOfLink={competitionRound}
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
                    <p className="heading">{`${settingsFactors[SEASON]} Winners`}</p>
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
    debugger;

    return {
        authenticated,
        hasCompetitionFinished, competitionRoundForNextDraw, competitionRoundForPlay, okToProceedWithDraw, haveFixturesForCompetitionRoundBeenPlayed, haveFixturesProducedReplays,
        teamsForCompetition, fixturesForCompetition, settingsFactors,
        teamsRemainingInCompetitionByDivision: helpers.getTeamsRemainingInCompetitionByDivision(teamsForCompetition, fixturesForCompetition, helpers.getPreviousCompetitionRound(competitionRoundForNextDraw)),
    }
}

Home.defaultProps = {
    haveFixturesProducedReplays: false,
}

Home.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    hasCompetitionFinished: PropTypes.bool.isRequired,
    competitionRoundForNextDraw: PropTypes.string.isRequired,
    competitionRoundForPlay: PropTypes.string.isRequired,
    okToProceedWithDraw: PropTypes.bool.isRequired,
    haveFixturesForCompetitionRoundBeenPlayed: PropTypes.bool.isRequired,
    haveFixturesProducedReplays: PropTypes.bool.isRequired,
    teamsForCompetition: PropTypes.array.isRequired,
    fixturesForCompetition: PropTypes.array.isRequired,
    settingsFactors: PropTypes.object.isRequired,
    teamsRemainingInCompetitionByDivision: PropTypes.array.isRequired,
}

export default connect(mapStateToProps, null)(Home);
