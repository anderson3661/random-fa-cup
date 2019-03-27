import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';

import { updateDbsAndStoreAfterCompetitionHasFinished } from '../../redux/actions/fixturesActions';

import FixturesLatestHeader from './fixtures-latest-header';
import CompetitionFinishedOrWrongStage from '../common/competition-finished-or-wrong-stage';
import FixturesLatestFixtures from './fixtures-latest-fixtures';
import GoalUpdates from './goal-updates';
import MyWatchlist from './my-watchlist';
import CupUpsets from './cup-upsets';
import PremierLeagueTeams from './premier-league-teams';
import DrawFixtures from '../draw/draw-fixtures';
import RouteToThisStage from './route-to-this-stage';
// import RouteToThisStage from '../route-to-this-stage/route-to-this-stage';
import * as helperFixtureUpdates from './fixtures-latest-helpers';
import * as helpers from '../../utilities/helper-functions/helpers';
import {Fixture} from '../../utilities/classes/fixture';
import { MAIN_BACKGROUND_IMAGE, IS_FIXTURES, QUARTER_FINALS, SEMI_FINALS, FINAL, FOURTH_ROUND } from '../../utilities/constants';

import ConfirmationDialog from '../dialogs/confirmationDialog';
import ConfirmationDialogWinners from '../dialogs/confirmationDialogWinners';

import Loading from '../loading/loading';

import '../../utilities/css/fixtures.scss';
import './fixtures-latest.scss';

const PAUSE_FIXTURES = "Pause Fixtures";
const START_FIXTURES = "Start Fixtures";
const START_SECOND_HALF = "Start Second Half";
const CONTINUE_FIXTURES = "Continue Fixtures";
const FIXTURES_FINISHED = "Fixtures Finished";
const START_EXTRA_TIME = "Start Extra Time";
const START_EXTRA_TIME_SECOND_HALF = "Start ET Second Half";
const START_PENALTIES = "Start Penalties";

const FIXTURE_UPDATE_INTERVAL = 'fixtureUpdateInterval';

class FixturesLatest extends Component {

    canTheLatestFixturesForThisCompetitionRoundProceed;
    hasCompetitionStarted;
    hasCompetitionFinished;
    frequencyOfUpdates;
    maxMinutesForPeriod;
    displayHeader;
    authenticated = true;
    updateInterval;
    counterMinutes;
    areFixturesInPlay = false;
    fixtures = [];
    fixtureUpdates = [];
    flattenedTeams;
    competitionRound;
    havePenaltiesStarted;
    // top3TeamsBeforeFixtures = ["", "", ""];
  

    constructor(props) {
        super(props);
        
        let i;
        let setOfFixturesForCompetitionRound;

        const { fixturesForCompetition, teamsForCompetition, goalFactors, hasCompetitionStarted, hasCompetitionFinished,
                competitionRoundForPlay, okToProceedWithDraw, haveFixturesForCompetitionRoundBeenPlayed, haveFixturesProducedReplays } = this.props;

        this.canTheLatestFixturesForThisCompetitionRoundProceed = !okToProceedWithDraw;

        //The following are set at the start of the component and their values WON'T change (i.e. they are just used for easier reference)
        this.hasCompetitionStarted = hasCompetitionStarted;
        this.hasCompetitionFinished = hasCompetitionFinished;

        this.competitionRound = '';
        
        if (this.hasCompetitionStarted) {
            debugger;
            
            if (this.canTheLatestFixturesForThisCompetitionRoundProceed) {
                this.flattenedTeams = helpers.getTeamsRemainingInCompetitionFlattened(teamsForCompetition, null);
                
                this.competitionRound = competitionRoundForPlay;

                setOfFixturesForCompetitionRound = helperFixtureUpdates.getSetOfFixturesForCompetitionRound(fixturesForCompetition, this.competitionRound, haveFixturesForCompetitionRoundBeenPlayed, haveFixturesProducedReplays);
                            
                this.latestFixtures = helperFixtureUpdates.getEmptySetOfFixtures();
                
                for (i = 0; i < setOfFixturesForCompetitionRound.length; i++) {
                    this.fixtures.push(new Fixture(setOfFixturesForCompetitionRound[i], teamsForCompetition));
                    this.fixtures[i].setUpFixture(goalFactors);
                }
            }
        }

        this.displayHeader = (hasCompetitionFinished ? 'Competition Finished' : helpers.getCompetitionRoundHeader(this.competitionRound) + (this.fixtures.length > 0 && this.fixtures[0].isReplay ? ' Replays' : ' Fixtures'));
        
        this.state = {
            counterMinutes: 1,
            haveLatestFixturesStarted: false,
            areFixturesInPlay: false,
            haveFixturesBeenPaused: false,
            startFixturesButtonEnabled: true,
            startFixturesButtonText: START_FIXTURES,
            [FIXTURE_UPDATE_INTERVAL]: goalFactors[FIXTURE_UPDATE_INTERVAL],
            showGoalUpdates: false,
            dialogLatestFixturesFinishedIsOpen: false,
            displayWinnersAtEndOfCompetition: false,
        }        
        
        this.handleStartSetOfFixtures = this.handleStartSetOfFixtures.bind(this);
        this.handleChangeShowGoalUpdates = this.handleChangeShowGoalUpdates.bind(this);
        this.handleChangeFixtureUpdateInterval = this.handleChangeFixtureUpdateInterval.bind(this);
    }

    handleChangeFixtureUpdateInterval = (updatedValue) => {
        this.setState({ [FIXTURE_UPDATE_INTERVAL]: updatedValue });
    }

    handleChangeShowGoalUpdates(checked) {
        this.setState({ showGoalUpdates: checked })
    }
    
    handleStartSetOfFixtures() {
        let speedOfUpdates;
        
        this.havePenaltiesStarted = false;

        if (this.state.startFixturesButtonText === PAUSE_FIXTURES) {

            clearInterval(this.updateInterval);

            this.setState({ haveFixturesBeenPaused: true, startFixturesButtonText: CONTINUE_FIXTURES });

        } else {

            if (!this.state.haveLatestFixturesStarted) {
                this.setState({ haveLatestFixturesStarted: true });
                this.setState({ areFixturesInPlay: true });
            }
            
            if (this.state.haveFixturesBeenPaused) {
                
                this.setState({ haveFixturesBeenPaused: false });
                
            } else {
                
                this.setState({ counterMinutes: 1 });                // Set to 1, as the first updates will be tested against the first minute
                this.maxMinutesForPeriod = 0                       // Set to zero as will be calculated for each fixture below

                debugger;
                
                this.fixtures.forEach(fixture => {
                    if (!fixture.hasFixtureFinished) {
                        fixture.startFixture();
                        
                        this.maxMinutesForPeriod = helperFixtureUpdates.getMaximumMinutes(fixture, this.maxMinutesForPeriod);      // Get the maximum number of minutes for this period of all fixtures in play

                        if (fixture.isPenalties) this.havePenaltiesStarted = true;
                    }
                });               
                
            }

            this.setState({ startFixturesButtonText: PAUSE_FIXTURES, });

            speedOfUpdates = (this.havePenaltiesStarted ? 3000 : 1000);

            this.updateInterval = setInterval(() => this.checkFixturesProgress(), this.state[FIXTURE_UPDATE_INTERVAL] * speedOfUpdates);

        }
    }

    checkFixturesProgress = () => {
        let fixtureMinuteUpdate;
        let hasAFixtureGoneToPenalties;
        let maxMinutesPlayedForFixture = 0;

        const { counterMinutes } = this.state;
        const { dispatch, fixturesForCompetition, goalFactors } = this.props;

        if (this.haveAllFixturesInThisSetFinished) return;      //Break out of the loop if fixtures have gone to penalties and the games have finished
        
        this.fixtures.forEach((fixture, i) => {
            if (!fixture.hasFixtureFinished) {
                hasAFixtureGoneToPenalties = fixture.isPenalties;
                fixtureMinuteUpdate = fixture.updateFixture(this.flattenedTeams, goalFactors);
                maxMinutesPlayedForFixture = Math.max(fixture.minutesPlayed, maxMinutesPlayedForFixture);
                if (!fixture.isPenalties && (fixtureMinuteUpdate.homeTeamUpdate || fixtureMinuteUpdate.awayTeamUpdate)) {
                    if (fixtureMinuteUpdate.homeTeamUpdate) this.updateWithLatestGoal(counterMinutes, fixture, fixtureMinuteUpdate.isFirstHalfBeforeUpdate, "Home");
                    if (fixtureMinuteUpdate.awayTeamUpdate) this.updateWithLatestGoal(counterMinutes, fixture, fixtureMinuteUpdate.isFirstHalfBeforeUpdate, "Away");
                }
            }
        });

        this.setState(prevState => ({ counterMinutes: prevState.counterMinutes + 1 }));

        if (this.maxMinutesForPeriod === counterMinutes || this.havePenaltiesStarted) {

            debugger;

            if (!this.havePenaltiesStarted) clearInterval(this.updateInterval);

            this.haveAllFixturesInThisSetFinished = (this.fixtures.filter(fixture => fixture.hasFixtureFinished).length === this.fixtures.length);
    
            if (this.haveAllFixturesInThisSetFinished) {
                debugger;
                this.setState({ startFixturesButtonText: FIXTURES_FINISHED, startFixturesButtonEnabled: false });
                helperFixtureUpdates.createUpdatesAfterFixturesHaveFinished(dispatch, fixturesForCompetition, this.fixtures, this.competitionRound, this.props.competitionRoundForPlay);
                this.setState({ areFixturesInPlay: false });
            } else {
                debugger;
                let fixturesButtonText = START_SECOND_HALF;
                if (maxMinutesPlayedForFixture >= 90 && maxMinutesPlayedForFixture < 105) fixturesButtonText = START_EXTRA_TIME;
                if (maxMinutesPlayedForFixture >= 105 && maxMinutesPlayedForFixture < 120) fixturesButtonText = START_EXTRA_TIME_SECOND_HALF;
                if (!this.havePenaltiesStarted && hasAFixtureGoneToPenalties) fixturesButtonText = START_PENALTIES;
                this.setState({ startFixturesButtonText: fixturesButtonText, startFixturesButtonEnabled: true });
            }
        }
    
    }

    updateWithLatestGoal(mins, fixture, isFirstHalfBeforeUpdate, scoringTeam) {
        this.fixtureUpdates.push(
            {
                mins: isFirstHalfBeforeUpdate ? (mins > 45 ? `45(+${mins - 45})` : mins) : (mins + 45 > 90 ? `90(+${mins + 45 - 90})` : mins + 45),
                homeTeam: fixture.homeTeam,
                homeTeamsScore: fixture.homeTeamsScore,
                homeTeamsScorePenalties: fixture.homeTeamsScorePenalties,
                awayTeam: fixture.awayTeam,
                awayTeamsScore: fixture.awayTeamsScore,
                awayTeamsScorePenalties: fixture.awayTeamsScorePenalties,
                scoringTeam: scoringTeam
            }
        );
    }

    authenticated() {
        // return this.auth.authenticated;
        return true;
    }

    componentWillReceiveProps(nextProps, prevState) {
        // The following is required in order to display the correct dialog message (i.e. it has either worked, or there has been a backend error)
        const { dispatch, fixturesForCompetition } = this.props;

        if (!nextProps.miscellaneous.loadingLatestFixtures && this.props.miscellaneous.loadingLatestFixtures) {
            if (nextProps.miscellaneous.loadingBackendError) {
                this.setState({ dialogLoadingBackendErrorConfirmIsOpen: true });     // If an error was encountered on the backend, then open the backend error dialog
            } else {
                // If the season has finished display the congratulations to winners dialog, otherwise display the latest fixtures have finished dialog
                if (helpers.isThisCompetitionRoundTheFinal(this.competitionRound) && helpers.haveAllFixturesInSetFinished(helpers.getFixturesArray(fixturesForCompetition, helpers.getCompetitionRoundIndex(this.competitionRound), IS_FIXTURES))) {
                    this.setState({ displayWinnersAtEndOfCompetition: true });
                    dispatch(updateDbsAndStoreAfterCompetitionHasFinished());
                } else {
                    this.setState({ dialogLatestFixturesFinishedIsOpen: true });
                }                
            }
        }
    }

    componentDidMount() {
        helpers.goToTopOfPage();
    }

    componentDidUpdate(prevProps, prevState) {
        // Scroll to the bottom of the Goal Updates window as it updates
        const div = document.getElementById("in-play-updates");
        if (div) div.scrollTop = div.scrollHeight - div.clientHeight;
    }

    componentWillUnmount() {
        clearInterval(this.updateInterval);
    }

    render() {

        const { startFixturesButtonText, startFixturesButtonEnabled, areFixturesInPlay, haveFixturesBeenPaused, showGoalUpdates, haveLatestFixturesStarted } = this.state;
        const { fixturesForCompetition, hasCompetitionFinished, myWatchlistTeams, latestFixturesHaveStarted } = this.props;
        const { season } = this.props.settingsFactors;

        return (

            <div className={`container-main-content-latest-fixtures${' '}${this.state.showGoalUpdates ? "show-goal-updates" : ""}${' '}
                ${hasCompetitionFinished ? 'competition-finished' :
                (!this.canTheLatestFixturesForThisCompetitionRoundProceed ? 'not-at-this-stage' : '')}`}>

                <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>

                { latestFixturesHaveStarted ? <Loading /> : null }

                <Prompt when={this.state.areFixturesInPlay} message="Are you sure you want to abandon these fixtures ?"/>

                {!this.canTheLatestFixturesForThisCompetitionRoundProceed ?
                    <CompetitionFinishedOrWrongStage hasCompetitionFinished={hasCompetitionFinished} displayHeader={this.displayHeader} displayType="fixtures" />

                    :

                    <Fragment>
                        {this.hasCompetitionStarted && !this.hasCompetitionFinished &&
                            <FixturesLatestHeader
                                authenticated={this.authenticated}
                                hasCompetitionStarted={this.hasCompetitionStarted}
                                hasCompetitionFinished={this.hasCompetitionFinished}
                                displayHeader={this.displayHeader}
                                startFixturesButtonText = {startFixturesButtonText}
                                startFixturesButtonEnabled = {startFixturesButtonEnabled}
                                fixtureUpdateInterval = {this.state[FIXTURE_UPDATE_INTERVAL]}
                                areFixturesInPlay = {areFixturesInPlay}
                                haveFixturesBeenPaused = {haveFixturesBeenPaused}
                                showGoalUpdates = {showGoalUpdates}
                                onClickStartSetOfFixtures = {this.handleStartSetOfFixtures}
                                onChangeFixtureUpdateInterval = {this.handleChangeFixtureUpdateInterval}
                                onChangeShowGoalUpdates = {this.handleChangeShowGoalUpdates}
                            />
                        }
                
                        {this.hasCompetitionStarted && !this.hasCompetitionFinished && (
                            <div className={`split-grid${' '}
                                            ${showGoalUpdates ? 'show-goal-updates' : ''}${' '}
                                            ${helpers.getCompetitionRoundForCSS(this.competitionRound)}${' '}
                                            ${this.fixtures[0].isReplay ? 'replays' : ''}${' '}
                                            `}>

                                <FixturesLatestFixtures fixtures={this.fixtures} haveLatestFixturesStarted={haveLatestFixturesStarted} />

                                {showGoalUpdates && <GoalUpdates fixtureUpdates={this.fixtureUpdates} />}

                                { this.competitionRound !== FINAL &&
                                    <div className="watchlists">

                                        { this.competitionRound !== QUARTER_FINALS && this.competitionRound !== SEMI_FINALS &&
                                            helpers.areAnyMyWatchlistTeamsPlaying(this.fixtures, myWatchlistTeams) &&
                                            <MyWatchlist myWatchlistTeams={myWatchlistTeams} fixtures={this.fixtures} haveLatestFixturesStarted={haveLatestFixturesStarted} />
                                        }

                                        { this.competitionRound !== QUARTER_FINALS && this.competitionRound !== SEMI_FINALS && 
                                            <CupUpsets teamsForCompetition={this.props.teamsForCompetition} fixtures={this.fixtures} haveLatestFixturesStarted={haveLatestFixturesStarted} />
                                        }

                                        { this.competitionRound !== QUARTER_FINALS && this.competitionRound !== SEMI_FINALS &&
                                            helpers.areAnyPremierLeagueTeamsPlaying(this.fixtures) &&
                                            <PremierLeagueTeams fixtures={this.fixtures} haveLatestFixturesStarted={haveLatestFixturesStarted} />
                                        }

                                        { (this.competitionRound === FOURTH_ROUND || this.competitionRound === QUARTER_FINALS || this.competitionRound === SEMI_FINALS) &&
                                            this.fixtures[0].isReplay &&
                                            <div className="container-card draw">
                                                <h2>{`Draw for ${helpers.getNextCompetitionRoundLabel(this.competitionRound)}`}</h2>
                                                <DrawFixtures fixturesMadeByDraw={helpers.getFixturesArray(fixturesForCompetition, helpers.getCompetitionRoundIndex(this.competitionRound) + 1, IS_FIXTURES)} />
                                            </div>
                                        }

                                    </div>
                                }

                                { (this.competitionRound === SEMI_FINALS || this.competitionRound === FINAL) &&
                                    <Fragment>
                                        <RouteToThisStage fixturesForCompetition={fixturesForCompetition} fixtureNumberForCSS="first" whichTeam="homeTeam" teamName={this.fixtures[0].homeTeam} competitionRound={this.competitionRound} />
                                        <RouteToThisStage fixturesForCompetition={fixturesForCompetition} fixtureNumberForCSS="first" whichTeam="awayTeam" teamName={this.fixtures[0].awayTeam} competitionRound={this.competitionRound} />
                                        {this.competitionRound === SEMI_FINALS &&
                                            <Fragment>
                                                <RouteToThisStage fixturesForCompetition={fixturesForCompetition} fixtureNumberForCSS="second" whichTeam="homeTeam" teamName={this.fixtures[1].homeTeam} competitionRound={this.competitionRound} />
                                                <RouteToThisStage fixturesForCompetition={fixturesForCompetition} fixtureNumberForCSS="second" whichTeam="awayTeam" teamName={this.fixtures[1].awayTeam} competitionRound={this.competitionRound} />
                                            </Fragment>
                                        }
                                    </Fragment>
                                }

                            </div>
                        )}

                        <ConfirmationDialog message="All fixtures have finished" open={this.state.dialogLatestFixturesFinishedIsOpen} onClose={() => this.setState({ dialogLatestFixturesFinishedIsOpen: false })} />
                        <ConfirmationDialogWinners season={season} winners={helpers.getWinningTeamInFinal(this.fixtures)} open={this.state.displayWinnersAtEndOfCompetition} onClose={() => this.setState({ displayWinnersAtEndOfCompetition: false })} />

                    </Fragment>
                }
            </div>
        );
    };
};

const mapStateToProps = (state) => {
    debugger;
    const { hasCompetitionStarted, hasCompetitionFinished, competitionRoundForNextDraw, competitionRoundForPlay, okToProceedWithDraw, haveFixturesForCompetitionRoundBeenPlayed, haveFixturesProducedReplays } = state.default.miscellaneous;
    return {
        miscellaneous: state.default.miscellaneous,
        fixturesForCompetition: state.default.fixturesForCompetition,
        teamsForCompetition: state.default.teamsForCompetition,
        myWatchlistTeams: state.default.myWatchlistTeams,
        settingsFactors: state.default.settingsFactors,
        goalFactors: state.default.settingsFactors.goalFactors,
        hasCompetitionStarted,
        hasCompetitionFinished,
        competitionRoundForNextDraw,
        competitionRoundForPlay,
        okToProceedWithDraw,
        haveFixturesForCompetitionRoundBeenPlayed,
        haveFixturesProducedReplays,
    }
}

FixturesLatest = connect(mapStateToProps, null)(FixturesLatest)

export default FixturesLatest;