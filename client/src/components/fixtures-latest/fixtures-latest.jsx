import React, { Component, Fragment } from 'react';
import Button from "@material-ui/core/Button";
import { connect } from 'react-redux';
import { Prompt } from 'react-router';

// import Typing from 'react-typing-animation';

import { updateDbsAndStoreAfterLatestResults, updateDbsAndStoreAfterSeasonHasFinished } from '../../redux/actions/fixturesActions';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from "@material-ui/core/TextField";
import FixtureRow from '../fixture-row/fixture-row';
import LeagueTable from '../league-table/league-table';
import * as helperFixtureUpdates from './fixtures-updates';
import * as helpers from '../../utilities/helper-functions/helpers';
import {Fixture} from '../../utilities/classes/fixture';
import { MAIN_BACKGROUND_IMAGE, FOOTBALL_IMAGE } from '../../utilities/constants';

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

    haveSeasonsFixturesBeenCreated;
    hasSeasonFinished
    dateOfThisSetOfFixtures = "";
    frequencyOfUpdates;
    maxMinutesForPeriod;
    displayHeader;
    latestFixtures;
    leagueTableBeforeFixtures;
    leagueTableInPlay;
    formattedDateOfFixtures;
    top3TeamsBeforeFixtures = ["", "", ""];
    authenticated = true;
    updateInterval;
    counterMinutes = 0;
    areFixturesInPlayForRouter = false;
    fixtureUpdates= [];
  

    constructor(props) {
        super(props);
        
        let i;
        let nextSetOfFixtures;
        let fixtures = [];

        debugger;
        const { fixturesForSeason, teamsForSeason, leagueTable, goalFactors, haveSeasonsFixturesBeenCreated, hasSeasonStarted, hasSeasonFinished, dateOfLastSetOfFixtures } = this.props;
        
        //The following are set at the start of the component and their values WON'T change (i.e. they are just used for easier reference)
        this.haveSeasonsFixturesBeenCreated = haveSeasonsFixturesBeenCreated;
        if (this.haveSeasonsFixturesBeenCreated) {
            this.hasSeasonFinished = hasSeasonFinished;
            this.displayHeader = this.hasSeasonFinished ? "Season finished" : "Latest Fixtures";
            
            nextSetOfFixtures = helperFixtureUpdates.getNextSetOfFixtures(hasSeasonStarted, dateOfLastSetOfFixtures, fixturesForSeason);

            if (nextSetOfFixtures !== undefined) {
                this.dateOfThisSetOfFixtures = nextSetOfFixtures.dateOfSetOfFixtures;
            }
            
            this.latestFixtures = helperFixtureUpdates.getEmptySetOfFixtures();

            for (i = 0; i < nextSetOfFixtures.fixtures.length; i++) {
                this.latestFixtures.fixtures.push(new Fixture(nextSetOfFixtures.fixtures[i], teamsForSeason));
                this.latestFixtures.dateOfSetOfFixtures = nextSetOfFixtures.dateOfSetOfFixtures;
                this.latestFixtures.fixtures[i].setUpFixture(goalFactors);
                fixtures.push(this.latestFixtures.fixtures[i].getFixtureObject());
            }
            
            this.formattedDateOfFixtures = helpers.formatDate(this.latestFixtures.dateOfSetOfFixtures);
            
            this.leagueTableBeforeFixtures = leagueTable;

            if (this.leagueTableBeforeFixtures[0].played > 0) {
                this.top3TeamsBeforeFixtures = [ this.leagueTableBeforeFixtures[0].teamName, this.leagueTableBeforeFixtures[1].teamName, this.leagueTableBeforeFixtures[2].teamName ];
            }
            
        } else {
            this.displayHeader = "New game ... please create fixtures for the season via Administration";
        }
        
        this.leagueTableInPlay = helperFixtureUpdates.setupInPlayLeagueTable(leagueTable);
        
        this.state = {
            haveLatestFixturesStarted: false,
            areFixturesInPlayForRouter: false,
            haveFixturesBeenPaused: false,
            haveAllFixturesInThisSetFinished: false,
            startFixturesButtonEnabled: true,
            startFixturesButtonText: START_FIXTURES,
            fixtures: fixtures,
            leagueTableInPlay: this.leagueTableInPlay,
            [FIXTURE_UPDATE_INTERVAL]: goalFactors[FIXTURE_UPDATE_INTERVAL],
            showGoalUpdates: false,
            dialogLatestFixturesFinishedIsOpen: false,
            dialogWinnersIsOpen: false,
            displayWinnersAtEndOfSeason: false,
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
                this.setState({ areFixturesInPlayForRouter: true });
            }
            
            if (this.state.haveFixturesBeenPaused) {
                
                this.setState({haveFixturesBeenPaused: false});
                
            } else {
                
                this.maxMinutesForPeriod = 0                       // Set to zero as will be calculated for each fixture below
                this.counterMinutes = 0;
                
                this.latestFixtures.fixtures.forEach(fixture => {
                    if (!fixture.hasFixtureFinished) {
                        fixture.startFixture();
                        this.leagueTableInPlay = helperFixtureUpdates.updateInPlayLeagueTable(fixture, this.leagueTableBeforeFixtures, this.leagueTableInPlay);      // Set up in play table before fixtures start (so all teams in the current fixture are drawing)
                        
                        this.maxMinutesForPeriod = helperFixtureUpdates.getMaximumMinutes(fixture, this.maxMinutesForPeriod);      // Get the maximum number of minutes for this period of all fixtures in play
                    }
                });               
                
                this.setState({leagueTableInPlay: this.leagueTableInPlay});
            }

            this.setState({ startFixturesButtonText: PAUSE_FIXTURES, });

            this.updateInterval = setInterval(() => this.checkFixturesProgress(), this.state[FIXTURE_UPDATE_INTERVAL] * 1000);

        }
    }

    checkFixturesProgress = () => {
        let fixtureMinuteUpdate;
        let updateAfterGoal;
        let fixturesNew;

        const { teamsForSeason, goalFactors } = this.props;

        this.counterMinutes++;

        this.latestFixtures.fixtures.forEach((fixture, i) => {
            fixtureMinuteUpdate = fixture.updateFixture(teamsForSeason, goalFactors);
            updateAfterGoal = false;
            if (fixtureMinuteUpdate.homeTeamUpdate || fixtureMinuteUpdate.awayTeamUpdate) {
                updateAfterGoal = true;
                if (fixtureMinuteUpdate.homeTeamUpdate) {
                    // this.fixtureUpdates.push({scoreUpdate: `${this.counterMinutes} mins - ${fixture.homeTeam} ${fixture.homeTeamsScore} ${fixture.awayTeam} ${fixture.awayTeamsScore}`, scoringTeam: fixture.homeTeam});
                    this.updateWithLatestGoal(this.counterMinutes, fixture, fixtureMinuteUpdate.isFirstHalfBeforeUpdate, "Home");
                }
                if (fixtureMinuteUpdate.awayTeamUpdate) {
                    // this.fixtureUpdates.push({scoreUpdate: `${this.counterMinutes} mins - ${fixture.homeTeam} ${fixture.homeTeamsScore} ${fixture.awayTeam} ${fixture.awayTeamsScore}`, scoringTeam: fixture.awayTeam});
                    this.updateWithLatestGoal(this.counterMinutes, fixture, fixtureMinuteUpdate.isFirstHalfBeforeUpdate, "Away");
                }
            }

            if (i === 0) {
                fixturesNew = [ fixture.getFixtureObject(), ...this.state.fixtures.slice(i+1) ]
            } else {
                fixturesNew = [...this.state.fixtures.slice(0, i), fixture.getFixtureObject(), ...this.state.fixtures.slice(i+1) ];
            }

            this.setState({ fixtures: fixturesNew });

            if (updateAfterGoal) {
                this.leagueTableInPlay = helperFixtureUpdates.updateInPlayLeagueTable(fixture, this.leagueTableBeforeFixtures, this.leagueTableInPlay);

                this.setState({ leagueTableInPlay: this.leagueTableInPlay });
            }
        });

        if (this.maxMinutesForPeriod === this.counterMinutes) {

            clearInterval(this.updateInterval);
    
            this.haveAllFixturesInThisSetFinished = (this.latestFixtures.fixtures.filter(fixture => fixture.hasFixtureFinished).length === this.latestFixtures.fixtures.length);
    
            if (this.haveAllFixturesInThisSetFinished) {
    
                this.setState({
                    startFixturesButtonText: FIXTURES_FINISHED,
                    startFixturesButtonEnabled: false                //Enable/Disable the Start Fixtures button
                });                
                
                this.props.dispatch(updateDbsAndStoreAfterLatestResults(this.state.fixtures, this.state.leagueTableInPlay, this.dateOfThisSetOfFixtures));

                this.setState({ areFixturesInPlayForRouter: false });

            } else {
                this.setState({
                    startFixturesButtonText: START_SECOND_HALF,
                    startFixturesButtonEnabled: true                //Enable/Disable the Start Fixtures button
                });
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
        const { fixturesForSeason, hasSeasonStarted } = this.props;

        debugger;
        if (!nextProps.miscellaneous.loadingLatestFixtures && this.props.miscellaneous.loadingLatestFixtures) {
            if (nextProps.miscellaneous.loadingBackendError) {
                this.setState({ dialogLoadingBackendErrorConfirmIsOpen: true });     // If an error was encountered on the backend, then open the backend error dialog
            } else {
                // If the season has finished display the congratulations to winners dialog, otherwise display the latest fixtures have finished dialog
                if (helperFixtureUpdates.getNextSetOfFixtures(hasSeasonStarted, this.dateOfThisSetOfFixtures, fixturesForSeason).fixtures.length === 0) {
                    this.setState({ displayWinnersAtEndOfSeason: true });
                    this.setState({ dialogWinnersIsOpen: true });
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
        const { fixturesForSeason, haveSeasonsFixturesBeenCreated, hasSeasonStarted, dateOfLastSetOfFixtures } = this.props;
        clearInterval(this.updateInterval);
        if (haveSeasonsFixturesBeenCreated && helperFixtureUpdates.getNextSetOfFixtures(hasSeasonStarted, dateOfLastSetOfFixtures, fixturesForSeason).fixtures.length === 0) {
            this.props.dispatch(updateDbsAndStoreAfterSeasonHasFinished());
        }
    }

    render() {

        const { latestFixturesHaveStarted } = this.props;

        return (            
            <div className={`container-main-content-latest-fixtures ${this.state.showGoalUpdates ? "show-goal-updates" : ""}`}>
                <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>
                { latestFixturesHaveStarted ? <Loading /> : null }

                <Prompt when={this.state.areFixturesInPlayForRouter} message="Are you sure you want to abandon these fixtures ?"/>

                <div className="container-card latest-fixtures-header">

                    <ConfirmationDialog message="All fixtures have finished" open={this.state.dialogLatestFixturesFinishedIsOpen} onClose={() => this.setState({ dialogLatestFixturesFinishedIsOpen: false })} />
                    <ConfirmationDialogWinners winners={this.state.leagueTableInPlay[0].teamName} open={this.state.dialogWinnersIsOpen} onClose={() => this.setState({ dialogWinnersIsOpen: false })} />

                    {(this.hasSeasonFinished || !this.haveSeasonsFixturesBeenCreated) && <div className="image-left"><img src={FOOTBALL_IMAGE} alt="" /></div>}
                    <h1>{ this.displayHeader }</h1>
                    {(this.hasSeasonFinished || !this.haveSeasonsFixturesBeenCreated) && <div className="image-right"><img src={FOOTBALL_IMAGE} alt="" /></div>}

                    {this.haveSeasonsFixturesBeenCreated && !this.hasSeasonFinished &&
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
                                    disabled={this.state.areFixturesInPlayForRouter && !this.state.haveFixturesBeenPaused}
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

                {this.haveSeasonsFixturesBeenCreated && !this.hasSeasonFinished && (
                    <div className={`split-grid ${this.state.showGoalUpdates ? "show-goal-updates" : ""}`}>

                        <div className="container-card fixtures">
                            <div className="fixtures-date">{this.formattedDateOfFixtures}</div>

                            <div className="fixtures in-play">
                                {this.state.fixtures.map((fixture, i) => {
                                    return (
                                        <FixtureRow
                                            key={i}                                        
                                            fixture={fixture}
                                            showForLatestFixtures={true}
                                            haveLatestFixturesStarted={this.state.haveLatestFixturesStarted}
                                            showGoals={false}
                                            top3TeamsBeforeFixtures={this.top3TeamsBeforeFixtures}
                                        />
                                    )
                                })}
                            </div>
                        </div>

                        {this.state.showGoalUpdates &&
                            <div className="container-card in-play-updates">
                                <div className="fixtures in-play-updates" id="in-play-updates">
                                    <h3>Goal Updates</h3>
                                    {/* {this.fixtureUpdates.map((update, i) => <p key={i}>{update.scoreUpdate}</p>)} */}
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

                        <div className="container-card league-table-as-it-stands">
                            <LeagueTable
                                // {...this.appData}
                                leagueTableTypeLatestFixtures={true}
                                leagueTableDuringLatestFixtures={this.state.leagueTableInPlay}
                                leagueTableBeforeLatestFixtures={this.leagueTableBeforeFixtures}
                                showGoalUpdates={this.state.showGoalUpdates}
                            />
                        </div>

                        {this.state.showGoalUpdates &&
                            <div className="container-card league-table-as-it-stands-repeat">
                                <LeagueTable
                                    // {...this.appData}
                                    leagueTableTypeLatestFixtures={true}
                                    leagueTableDuringLatestFixtures={this.state.leagueTableInPlay}
                                    leagueTableBeforeLatestFixtures={this.leagueTableBeforeFixtures}
                                    showGoalUpdates={this.state.showGoalUpdates}
                                />
                            </div>
                        }
                    </div>
                )}
            </div>
        );
    };
};

const mapStateToProps = (state, ownProps) => {
    debugger;
    const { haveSeasonsFixturesBeenCreated, hasSeasonStarted, hasSeasonFinished, dateOfLastSetOfFixtures } = state.default.miscellaneous;
    return {
        miscellaneous: state.default.miscellaneous,
        fixturesForSeason: state.default.fixturesForSeason,
        teamsForSeason: state.default.teamsForSeason,
        leagueTable: state.default.leagueTable,
        goalFactors: state.default.adminFactors.goalFactors,
        haveSeasonsFixturesBeenCreated, hasSeasonStarted, hasSeasonFinished, dateOfLastSetOfFixtures,
    }
}

FixturesLatest = connect(mapStateToProps, null)(FixturesLatest)

export default FixturesLatest;