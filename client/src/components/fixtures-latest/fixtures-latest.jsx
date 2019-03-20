import React, { Component, Fragment } from 'react';
import Button from "@material-ui/core/Button";
import { connect } from 'react-redux';
import { Prompt } from 'react-router';

// import Typing from 'react-typing-animation';

import { updateDbsAndStoreAfterCompetitionHasFinished } from '../../redux/actions/fixturesActions';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from "@material-ui/core/TextField";
import FixtureRow from '../fixture-row/fixture-row';
import RouteToThisStage from '../route-to-this-stage/route-to-this-stage';
import * as helperFixtureUpdates from './fixtures-latest-helpers';
import * as helpers from '../../utilities/helper-functions/helpers';
import {Fixture} from '../../utilities/classes/fixture';
import { MAIN_BACKGROUND_IMAGE, FOOTBALL_IMAGE, DIVISIONS, IS_FIXTURES, QUARTER_FINALS, SEMI_FINALS, FINAL } from '../../utilities/constants';

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

const FIXTURE_UPDATE_INTERVAL = 'fixtureUpdateInterval';

class FixturesLatest extends Component {

    canTheLatestFixturesForThisCompetitionRoundProceed;
    hasCompetitionStarted;
    hasCompetitionFinished;
    frequencyOfUpdates;
    maxMinutesForPeriod;
    displayHeader;
    latestFixtures;
    authenticated = true;
    updateInterval;
    counterMinutes = 0;
    areFixturesInPlay = false;
    fixtureUpdates= [];
    flattenedTeams;
    competitionRound;
    // top3TeamsBeforeFixtures = ["", "", ""];
  

    constructor(props) {
        super(props);
        
        let i;
        let nextSetOfFixtures;
        let fixtures = [];

        const { fixturesForCompetition, teamsForCompetition, goalFactors, hasCompetitionStarted, hasCompetitionFinished } = this.props;

        this.canTheLatestFixturesForThisCompetitionRoundProceed = false;

        //The following are set at the start of the component and their values WON'T change (i.e. they are just used for easier reference)
        this.hasCompetitionStarted = hasCompetitionStarted;
        this.hasCompetitionFinished = hasCompetitionFinished;
        
        if (this.hasCompetitionFinished) {
            this.displayHeader = "Competition Finished";
        } else {
            if (this.hasCompetitionStarted) {
                
                if (helpers.canLatestFixturesProceed(fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished)) {
                    this.canTheLatestFixturesForThisCompetitionRoundProceed = true;
                }

                if (this.canTheLatestFixturesForThisCompetitionRoundProceed) {
                    this.flattenedTeams = helpers.getTeamsRemainingInCompetitionFlattened(teamsForCompetition, null);
                    
                    nextSetOfFixtures = helperFixtureUpdates.getNextSetOfFixtures(fixturesForCompetition);
                    this.competitionRound = nextSetOfFixtures.competitionRound;
                                
                    this.latestFixtures = helperFixtureUpdates.getEmptySetOfFixtures();
                    
                    for (i = 0; i < nextSetOfFixtures.fixtures.length; i++) {
                        this.latestFixtures.fixtures.push(new Fixture(nextSetOfFixtures.fixtures[i], teamsForCompetition));
                        this.latestFixtures.fixtures[i].setUpFixture(goalFactors);
                        fixtures.push(this.latestFixtures.fixtures[i].getFixtureObject());
                    }
                    this.displayHeader = helpers.getCompetitionRoundHeader(this.competitionRound) + (fixtures.length > 0 && fixtures[0].isReplay ? ' Replays' : ' Fixtures');
                } else {
                    this.displayHeader = "New game ... please draw fixtures for Round 1";
                }
                
            } else {
                this.displayHeader = "New game ... please draw fixtures for Round 1";
            }
        }
        
        this.state = {
            haveLatestFixturesStarted: false,
            areFixturesInPlay: false,
            haveFixturesBeenPaused: false,
            haveAllFixturesInThisSetFinished: false,
            startFixturesButtonEnabled: true,
            startFixturesButtonText: START_FIXTURES,
            fixtures: fixtures,
            [FIXTURE_UPDATE_INTERVAL]: goalFactors[FIXTURE_UPDATE_INTERVAL],
            showGoalUpdates: false,
            dialogLatestFixturesFinishedIsOpen: false,
            dialogWinnersIsOpen: false,
            displayWinnersAtEndOfCompetition: false,
        }        
        
        this.startSetOfFixtures = this.startSetOfFixtures.bind(this);
        // this.handleChangeGoalUpdates = this.handleChangeGoalUpdates.bind(this);
        
    }

    handleChangeFixtureUpdateInterval = () => (e) => {
        this.setState({[FIXTURE_UPDATE_INTERVAL]: e.target.value});
    }

    handleChangeShowGoalUpdates(e) {
        this.setState({showGoalUpdates: e.target.checked})
    }
    
    startSetOfFixtures() {

        if (this.state.startFixturesButtonText === PAUSE_FIXTURES) {

            clearInterval(this.updateInterval);

            this.setState({
                haveFixturesBeenPaused: true,
                startFixturesButtonText: CONTINUE_FIXTURES
            });

        } else {

            if (!this.state.haveLatestFixturesStarted) {
                this.setState({ haveLatestFixturesStarted: true });
                this.setState({ areFixturesInPlay: true });
            }
            
            if (this.state.haveFixturesBeenPaused) {
                
                this.setState({haveFixturesBeenPaused: false});
                
            } else {
                
                this.maxMinutesForPeriod = 0                       // Set to zero as will be calculated for each fixture below
                this.counterMinutes = 0;
                
                this.latestFixtures.fixtures.forEach(fixture => {
                    if (!fixture.hasFixtureFinished) {
                        fixture.startFixture();
                        
                        this.maxMinutesForPeriod = helperFixtureUpdates.getMaximumMinutes(fixture, this.maxMinutesForPeriod);      // Get the maximum number of minutes for this period of all fixtures in play
                    }
                });               
                
            }

            this.setState({ startFixturesButtonText: PAUSE_FIXTURES, });

            this.updateInterval = setInterval(() => this.checkFixturesProgress(), this.state[FIXTURE_UPDATE_INTERVAL] * 1000);

        }
    }

    checkFixturesProgress = () => {
        let fixtureMinuteUpdate;
        let updateAfterGoal;
        let fixturesNew;

        const { fixtures } = this.state;
        const { dispatch, fixturesForCompetition, goalFactors } = this.props;

        this.counterMinutes++;

        fixturesNew = [...this.latestFixtures.fixtures];
        fixturesNew.forEach((fixture, i) => {
            fixtureMinuteUpdate = fixture.updateFixture(this.flattenedTeams, goalFactors);
            updateAfterGoal = false;
            if (fixtureMinuteUpdate.homeTeamUpdate || fixtureMinuteUpdate.awayTeamUpdate) {
                updateAfterGoal = true;
                if (fixtureMinuteUpdate.homeTeamUpdate) this.updateWithLatestGoal(this.counterMinutes, fixture, fixtureMinuteUpdate.isFirstHalfBeforeUpdate, "Home");
                if (fixtureMinuteUpdate.awayTeamUpdate) this.updateWithLatestGoal(this.counterMinutes, fixture, fixtureMinuteUpdate.isFirstHalfBeforeUpdate, "Away");
            }
            fixturesNew[i] = fixture.getFixtureObject();
        });

        this.setState({ fixtures: fixturesNew });

        if (this.maxMinutesForPeriod === this.counterMinutes) {

            clearInterval(this.updateInterval);

            this.haveAllFixturesInThisSetFinished = (this.latestFixtures.fixtures.filter(fixture => fixture.hasFixtureFinished).length === this.latestFixtures.fixtures.length);
    
            if (this.haveAllFixturesInThisSetFinished) {
                this.setState({ startFixturesButtonText: FIXTURES_FINISHED, startFixturesButtonEnabled: false });
                helperFixtureUpdates.createUpdatesAfterFixturesHaveFinished(dispatch, fixturesForCompetition, fixtures, this.competitionRound);
                this.setState({ areFixturesInPlay: false });
            } else {
                this.setState({ startFixturesButtonText: START_SECOND_HALF, startFixturesButtonEnabled: true });
            }
        }
    
    }

    updateWithLatestGoal(mins, fixture, isFirstHalfBeforeUpdate, scoringTeam) {
        this.fixtureUpdates.push(
            {
                mins: isFirstHalfBeforeUpdate ? (mins > 45 ? `45(+${mins - 45})` : mins) : (mins + 45 > 90 ? `90(+${mins + 45 - 90})` : mins + 45),
                homeTeam: fixture.homeTeam,
                homeTeamsScore: fixture.homeTeamsScore,
                awayTeam: fixture.awayTeam,
                awayTeamsScore: fixture.awayTeamsScore,
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
                    this.setState({ dialogWinnersIsOpen: true });
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

        const { fixturesForCompetition, hasCompetitionFinished, myWatchlistTeams, latestFixturesHaveStarted } = this.props;
        const { season } = this.props.adminFactors;

        return (            
            <div className={`container-main-content-latest-fixtures ${this.state.showGoalUpdates ? "show-goal-updates" : ""}`}>
                <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>
                { latestFixturesHaveStarted ? <Loading /> : null }

                <Prompt when={this.state.areFixturesInPlay} message="Are you sure you want to abandon these fixtures ?"/>

                {!this.canTheLatestFixturesForThisCompetitionRoundProceed ?
                    <div className={`container-card latest-fixtures-header ${hasCompetitionFinished ? 'competition-finished' : ''}`}>
                        <div className="main-header">
                            <div className="image-left"><img src={FOOTBALL_IMAGE} alt="" /></div>
                            <h1>{ this.displayHeader }</h1>
                            <div className="image-right"><img src={FOOTBALL_IMAGE} alt="" /></div>
                        </div>
                        <div className="not-at-this-stage">{hasCompetitionFinished ? 'In order to play again, please reset the app via Settings' : 'The fixtures for this round cannot take place at this stage of the competition'}</div>
                    </div>
                    :
                    <Fragment>
                        <div className="container-card latest-fixtures-header">

                            <ConfirmationDialog message="All fixtures have finished" open={this.state.dialogLatestFixturesFinishedIsOpen} onClose={() => this.setState({ dialogLatestFixturesFinishedIsOpen: false })} />
                            <ConfirmationDialogWinners season={season} winners={helpers.getWinningTeamInFinal(this.state.fixtures)} open={this.state.dialogWinnersIsOpen} onClose={() => this.setState({ dialogWinnersIsOpen: false })} />

                            <div className="main-header">
                                {(this.hasCompetitionFinished || !this.hasCompetitionStarted) && <div className="image-left"><img src={FOOTBALL_IMAGE} alt="" /></div>}
                                <h1>{ this.displayHeader }</h1>
                                {(this.hasCompetitionFinished || !this.hasCompetitionStarted) && <div className="image-right"><img src={FOOTBALL_IMAGE} alt="" /></div>}
                            </div>

                            {this.hasCompetitionStarted && !this.hasCompetitionFinished &&
                                <Fragment>
                                    <div className="fixture-update-button">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            id="startSetOfFixtures"
                                            onClick={this.startSetOfFixtures}
                                            value={this.state.startFixturesButtonText}
                                            disabled={!this.authenticated || !this.state.startFixturesButtonEnabled}
                                            >{this.state.startFixturesButtonText}
                                        </Button>
                                    </div>

                                    <div className="fixture-update-interval">
                                        <TextField
                                            id={FIXTURE_UPDATE_INTERVAL}
                                            label="Fixture Update Interval (seconds)"
                                            placeholder="e.g. 0.5"
                                            className="form-control"
                                            fullWidth
                                            disabled={this.state.areFixturesInPlay && !this.state.haveFixturesBeenPaused}
                                            value={this.state[FIXTURE_UPDATE_INTERVAL]}
                                            onChange={this.handleChangeFixtureUpdateInterval(FIXTURE_UPDATE_INTERVAL)}
                                        />
                                    </div>

                                    <div className="showGoalUpdates">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    className="showGoalsText"
                                                    checked={this.state.showGoalUpdates}
                                                    onChange={this.handleChangeShowGoalUpdates.bind(this)}
                                                    value={this.state.showGoalUpdates.toString()}
                                                />
                                            }
                                            label="Show Goal Updates"
                                        />                        
                                    </div>
                                </Fragment>
                            }
                        </div>

                        {this.hasCompetitionStarted && !this.hasCompetitionFinished && (
                            <div className={`split-grid ${this.state.showGoalUpdates ? "show-goal-updates" : ""}`}>

                                <div className="container-card fixtures">
                                    {/* <div className="fixtures-date">{this.formattedDateOfFixtures}</div> */}

                                    <div className="fixtures in-play">
                                        {this.state.fixtures.map((fixture, i) => {
                                            return (
                                                <FixtureRow
                                                    key={i}                                        
                                                    fixture={fixture}
                                                    showForLatestFixtures={true}
                                                    haveLatestFixturesStarted={this.state.haveLatestFixturesStarted}
                                                    showGoals={false}
                                                    // top3TeamsBeforeFixtures={this.top3TeamsBeforeFixtures}
                                                />
                                            )
                                        })}
                                    </div>
                                </div>

                                {this.state.showGoalUpdates &&
                                    <div className="container-card in-play-updates">
                                        <div className="fixtures in-play-updates" id="in-play-updates">
                                            <h3>Goal Updates</h3>
                                            {this.fixtureUpdates.map((update, i) => {
                                                return (
                                                <p key={i}>
                                                    {/* <Typing> */}
                                                        <span className="mins">{update.mins}</span>
                                                        <span className={`team ${update.scoringTeam === "Home" ? "goal" : ""}`}>{update.homeTeam} {update.homeTeamsScore}</span>
                                                        &nbsp;&nbsp;
                                                        <span className={`team ${update.scoringTeam === "Away" ? "goal" : ""}`}>{update.awayTeam} {update.awayTeamsScore}</span>
                                                    {/* </Typing> */}
                                                </p>
                                                )
                                            })}
                                        </div>
                                    </div>
                                }

                                <div className="watchlists">

                                    { this.competitionRound !== QUARTER_FINALS && this.competitionRound !== SEMI_FINALS && this.competitionRound !== FINAL &&
                                        helpers.areAnyMyWatchlistTeamsPlaying(this.state.fixtures, myWatchlistTeams) &&
                                        <div className="container-card my-watchlist">
                                            <h2>My Watchlist</h2>

                                            <div className="fixtures my-watchlist">
                                                {this.state.fixtures.map((fixture, i) => {
                                                    // Convert fixture (an object) to an array as the areAnyMyWatchlistTeamsPlaying function requires this
                                                    if (helpers.areAnyMyWatchlistTeamsPlaying([fixture], myWatchlistTeams)) {
                                                        return (
                                                            <FixtureRow
                                                                key={i}                                        
                                                                fixture={fixture}
                                                                showForLatestFixtures={true}
                                                                haveLatestFixturesStarted={this.state.haveLatestFixturesStarted}
                                                                showGoals={false}
                                                                showVersus={true}
                                                            />
                                                        )
                                                    }
                                                })}
                                            </div>
                                        </div>
                                    }

                                    { this.competitionRound !== QUARTER_FINALS && this.competitionRound !== SEMI_FINALS && this.competitionRound !== FINAL && 
                                        <div className="container-card cup-upsets">
                                            <h2>Cup Upsets</h2>

                                            <div className="fixtures cup-upsets">
                                                {this.state.fixtures.map((fixture, i) => {
                                                    if (helpers.isACupUpset(this.props.teamsForCompetition, fixture)) {
                                                        return (
                                                            <FixtureRow
                                                                key={i}                                        
                                                                fixture={fixture}
                                                                showForLatestFixtures={true}
                                                                haveLatestFixturesStarted={this.state.haveLatestFixturesStarted}
                                                                showGoals={false}
                                                                showVersus={true}
                                                                // top3TeamsBeforeFixtures={this.top3TeamsBeforeFixtures}
                                                            />
                                                        )
                                                    }
                                                })}
                                            </div>
                                        </div>
                                    }

                                    { this.competitionRound !== QUARTER_FINALS && this.competitionRound !== SEMI_FINALS && this.competitionRound !== FINAL &&
                                        helpers.areAnyPremierLeagueTeamsPlaying(this.state.fixtures) &&
                                        <div className="container-card premier-league-teams">
                                            <h2>Premier League Teams</h2>

                                            <div className="fixtures premier-league-teams">
                                                {this.state.fixtures.map((fixture, i) => {
                                                    if (fixture.homeTeamDivision === DIVISIONS[0] || fixture.awayTeamDivision === DIVISIONS[0]) {
                                                        return (
                                                            <FixtureRow
                                                                key={i}                                        
                                                                fixture={fixture}
                                                                showForLatestFixtures={true}
                                                                haveLatestFixturesStarted={this.state.haveLatestFixturesStarted}
                                                                showGoals={false}
                                                                showVersus={true}
                                                                // top3TeamsBeforeFixtures={this.top3TeamsBeforeFixtures}
                                                            />
                                                        )
                                                    }
                                                })}
                                            </div>
                                        </div>
                                    }

                                    { this.competitionRound === FINAL &&
                                        <div className="container-card route-to-this-stage">
                                            <h2>Route to the final</h2>

                                            <div className="fixtures route-to-this-stage">
                                                { helpers.getFixturesPlayedForTeam(fixturesForCompetition, this.state.fixtures[0].homeTeam, this.competitionRound).map((fixture, i) => {
                                                    return (
                                                        <FixtureRow
                                                            key={i}                                        
                                                            fixture={fixture}
                                                            showForLatestFixtures={false}
                                                            haveLatestFixturesStarted={false}
                                                            showGoals={true}
                                                            showVersus={false}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    }
                                    
                                    { this.competitionRound === FINAL &&
                                        <div className="container-card route-to-this-stage">
                                            <h2>Route to the final</h2>

                                            <div className="fixtures route-to-this-stage">
                                                { helpers.getFixturesPlayedForTeam(fixturesForCompetition, this.state.fixtures[0].awayTeam, this.competitionRound).map((fixture, i) => {
                                                    return (
                                                        <FixtureRow
                                                            key={i}                                        
                                                            fixture={fixture}
                                                            showForLatestFixtures={false}
                                                            haveLatestFixturesStarted={false}
                                                            showGoals={true}
                                                            showVersus={false}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    }

                                    {/* <RouteToThisStage fixturesForCompetition={fixturesForCompetition} teamName="Manchester United" />                                         */}

                                </div>

                            </div>
                        )}
                    </Fragment>
                }
            </div>
        );
    };
};

const mapStateToProps = (state, ownProps) => {
    debugger;
    const { hasCompetitionStarted, hasCompetitionFinished } = state.default.miscellaneous;
    return {
        miscellaneous: state.default.miscellaneous,
        fixturesForCompetition: state.default.fixturesForCompetition,
        teamsForCompetition: state.default.teamsForCompetition,
        myWatchlistTeams: state.default.myWatchlistTeams,
        adminFactors: state.default.adminFactors,
        goalFactors: state.default.adminFactors.goalFactors,
        hasCompetitionStarted,
        hasCompetitionFinished,
    }
}

FixturesLatest = connect(mapStateToProps, null)(FixturesLatest)

export default FixturesLatest;