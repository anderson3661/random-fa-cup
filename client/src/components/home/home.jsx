import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import TeamsLeftByDivision from './teams-left-by-division';
import * as helpers from '../../utilities/helper-functions/helpers';

import { MAIN_BACKGROUND_IMAGE, FA_CUP_IMAGE, COMPETITION_ROUNDS, COMPETITION_ROUNDS_HEADINGS } from '../../utilities/constants';


import './home.scss';


const Home = (props) => {

    const { teamsForCompetition, fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished } = props;

    return (

        <div className="container-home">
            <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>

            {/* <div className="nav-home"></div> */}

            <div className="fa-cup-image">
                <img src={FA_CUP_IMAGE} alt=""></img>
            </div>

            {roundDiv(fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished, 1)}
            {roundDiv(fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished, 2)}
            {roundDiv(fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished, 3)}
            {roundDiv(fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished, 4)}
            {roundDiv(fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished, 5)}
            {roundDiv(fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished, 6)}
            {roundDiv(fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished, 7)}

            {!hasCompetitionFinished &&
                <TeamsLeftByDivision
                    teamsForCompetition={teamsForCompetition}
                    fixturesForCompetition={fixturesForCompetition}
                    hasCompetitionStarted={hasCompetitionStarted}
                />
            }

            {hasCompetitionFinished &&
                <div className="container-card display-winners">
                    <p className="heading">2018/19 Winners</p>
                    <p className="winners">Manchester United</p>
                </div>
            }
            
        </div>
    );
}
 
const roundDiv = (fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished, roundNumberOfFootball) => {
    const competitionRound = COMPETITION_ROUNDS[roundNumberOfFootball - 1];
    const nextCompetitionRoundForDraw = helpers.getNextCompetitionRoundForDraw(fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished);
    const competitionRoundIndexForDraw = COMPETITION_ROUNDS.indexOf(nextCompetitionRoundForDraw.competitionRound);
    const competitionRoundForPlay = helpers.getCompetitionRoundForPlay(fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished);
    const labelContainsReplaysIndex = competitionRoundForPlay.label.indexOf("Replays");
    const competitionRoundPlayReplays = (labelContainsReplaysIndex !== -1);
    const competitionRoundIndexForPlay = COMPETITION_ROUNDS_HEADINGS.indexOf(labelContainsReplaysIndex === -1 ? competitionRoundForPlay.label : competitionRoundForPlay.label.substr(0, labelContainsReplaysIndex - 1));
    const isThisCompetitionRoundActiveForDraw = (roundNumberOfFootball === (competitionRoundIndexForDraw + 1));
    const isThisCompetitionRoundActiveForPlay = (roundNumberOfFootball === (competitionRoundIndexForPlay + 1));
    const canDisplayDrawLabel = (nextCompetitionRoundForDraw.okToProceedWithDraw && isThisCompetitionRoundActiveForDraw);
    const canDisplayPlayFixturesLabel = (competitionRoundForPlay.okToProceedWithPlay && isThisCompetitionRoundActiveForPlay);
    const canDisplayFixturesAndResultsLabel = (
            hasCompetitionFinished ||
            (isThisCompetitionRoundActiveForPlay && !competitionRoundForPlay.okToProceedWithPlay) ||
            ((competitionRoundIndexForPlay === -1 && roundNumberOfFootball < (competitionRoundIndexForDraw + 1)) ||
            (!isThisCompetitionRoundActiveForPlay && roundNumberOfFootball <= (competitionRoundIndexForPlay + (competitionRoundPlayReplays ? 2 : 1)))));
    const isCompetitionRoundActive = (canDisplayDrawLabel || canDisplayPlayFixturesLabel || canDisplayFixturesAndResultsLabel);
    const isCompetitionRoundFinished = helpers.haveAllFixturesAndReplaysForCompetitionRoundFinished(fixturesForCompetition, roundNumberOfFootball - 1);
    const areReplaysForCompetitionRoundStillToBePlayed = helpers.areReplaysForCompetitionRoundStillToBePlayed(fixturesForCompetition, roundNumberOfFootball - 1);
    const linkTo = canDisplayDrawLabel ? '/draw' : (canDisplayPlayFixturesLabel ? '/fixtures-latest' : (canDisplayFixturesAndResultsLabel ? '/fixtures-and-results' : ""));
    if (roundNumberOfFootball === 5) {
        debugger;
    }
    return (
        <NavLink to={linkTo} className="nav-link" activeClassName="active-link">
            <div className={`competition-round ${"_" + competitionRound} ${isCompetitionRoundActive ? "active" : "deactivated"}`}>
                <div className="competition-round-label">{COMPETITION_ROUNDS_HEADINGS[roundNumberOfFootball - 1]}</div>
                {canDisplayDrawLabel && <div>Draw</div>}
                {canDisplayPlayFixturesLabel && <div>Play {competitionRoundPlayReplays ? "Replays" : "Fixtures"}</div>}
                {canDisplayFixturesAndResultsLabel && <div className="fixtures-and-results">{isCompetitionRoundFinished ? "Results" : (areReplaysForCompetitionRoundStillToBePlayed ? "Fixtures / Results" : "Fixtures") }</div>}
            </div>
        </NavLink>
    )
}


const mapStateToProps = (state, ownProps) => {
    const { hasCompetitionStarted, hasCompetitionFinished } = state.default.miscellaneous;
    return {
        teamsForCompetition: state.default.teamsForCompetition,
        fixturesForCompetition: state.default.fixturesForCompetition,
        hasCompetitionStarted,
        hasCompetitionFinished,
    }
}

export default connect(mapStateToProps, null)(Home);
