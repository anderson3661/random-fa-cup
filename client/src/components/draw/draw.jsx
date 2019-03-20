import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { Prompt } from 'react-router';

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import { updateDbsAndStoreAfterDraw } from '../../redux/actions/drawActions';

import DrawTeam from "./draw-team";
import DrawTeamLabels from "./draw-team-labels";
import DrawMyWatchlist from "./draw-my-watchlist";
import DrawPremierLeagueTeams from "./draw-premier-league-teams";
import * as helpers from '../../utilities/helper-functions/helpers';

import ConfirmationDialog from '../dialogs/confirmationDialog';

import { MAIN_BACKGROUND_IMAGE, FOOTBALL_IMAGE, QUARTER_FINALS, SEMI_FINALS, FINAL, DEFAULT_VALUE_COMPETITION_START_DATE, DEFAULT_VALUE_COMPETITION_START_TIME, COMPETITION_ROUNDS, COMPETITION_ROUNDS_FIXTURES, IS_FIXTURES } from '../../utilities/constants';

import "./draw.scss";

const PAUSE_DRAW = "Pause Draw";
const START_DRAW = "Start Draw";
const CONTINUE_DRAW = "Continue Draw";
const DRAW_COMPLETED = "Draw Completed";

const DRAW_UPDATE_INTERVAL = 0.1;

class Draw extends Component {

    canTheDrawForThisCompetitionRoundProceed;
    competitionRound;
    teamsRemainingInCompetitionFlattened;
    updateInterval;
    fixturesMadeByDraw;
    counter;
    nextCompetitionRoundForDraw;
    areAnyMyWatchlistTeamsInTheDraw;
    latestFixtureToBeDrawn;
    latestTeamToBeDrawn;
    latestTeamToBeDrawnNumber;
    myWatchlist = [];
    premierLeagueTeams = [];

    constructor(props) {
        super(props);

        this.startDraw = this.startDraw.bind(this);

        const { teamsForCompetition, myWatchlistTeams, fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished } = this.props;

        this.canTheDrawForThisCompetitionRoundProceed = false;

        this.nextCompetitionRoundForDraw = helpers.getNextCompetitionRoundForDraw(fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished);
        this.competitionRound = this.nextCompetitionRoundForDraw.competitionRound;
        
        if (this.nextCompetitionRoundForDraw.okToProceedWithDraw) {            

            debugger;
            this.teamsRemainingInCompetitionFlattened = helpers.getTeamsRemainingInCompetitionFlattened(teamsForCompetition, fixturesForCompetition, this.competitionRound);

            if (this.teamsRemainingInCompetitionFlattened.length > 0) {
                this.canTheDrawForThisCompetitionRoundProceed = true;

                this.counter = -1;

                this.fixturesMadeByDraw = [];
                for (let i = 0; i < this.teamsRemainingInCompetitionFlattened.length / 2; i++) {
                    this.fixturesMadeByDraw.push({});
                }

            }
        }

        this.state = {
            isDrawInProgress: false,
            isDrawCompleted: false,
            hasDrawBeenPaused: false,
            startDrawButtonEnabled: true,
            startDrawButtonText: START_DRAW,
            drawUpdateInterval: DRAW_UPDATE_INTERVAL,
            dialogDrawCompletedIsOpen: false,
            teamsToBeDrawn: this.teamsRemainingInCompetitionFlattened && this.teamsRemainingInCompetitionFlattened.map((team, i) => Object.assign({}, team, { teamNumberInDraw: i})),
        }

        if (this.state.teamsToBeDrawn) {
            this.areAnyMyWatchlistTeamsInTheDraw = helpers.areAnyMyWatchlistTeamsInTheDraw(this.state.teamsToBeDrawn, myWatchlistTeams);
        }
    }

    componentWillReceiveProps(nextProps, prevState) {
        // The following is required in order to display the correct dialog message (i.e. it has either worked, or there has been a backend error)
        if (!nextProps.miscellaneous.loadingDraw && this.props.miscellaneous.loadingDraw) {
            if (nextProps.miscellaneous.loadingBackendError) {
                this.setState({ dialogLoadingBackendErrorConfirmIsOpen: true });     // If an error was encountered on the backend, then open the backend error dialog
            } else {
                this.setState({ dialogDrawCompletedIsOpen: true });
            }
        }
    }

    handleChangeDrawUpdateInterval = () => (e) => {
        this.setState({ drawUpdateInterval: e.target.value});
    }

    startDraw() {
        if (this.state.startDrawButtonText === PAUSE_DRAW) {
            clearInterval(this.updateInterval);
            this.setState({ hasDrawBeenPaused: true, startDrawButtonText: CONTINUE_DRAW });
        } else {
            if (!this.state.isDrawInProgress) this.setState({ isDrawInProgress: true });
            if (this.state.hasDrawBeenPaused) this.setState({ hasDrawBeenPaused: false });                
            this.setState({ startDrawButtonText: PAUSE_DRAW });
            this.updateInterval = setInterval(() => this.checkDrawProgress(), this.state.drawUpdateInterval * 1000);
        }
    }

    checkDrawProgress = () => {
        let divisionTheTeamPlaysIn;
        this.counter++;
        const randomTeamNumber = helpers.getRandomNumber(this.state.teamsToBeDrawn.length);
        const randomTeamName = this.state.teamsToBeDrawn[randomTeamNumber].teamName;
        const arrayIndex = Math.floor(this.counter / 2, 0);
        this.fixturesMadeByDraw[arrayIndex].competitionRound = this.competitionRound;
        this.fixturesMadeByDraw[arrayIndex][this.counter%2 === 0 ? 'homeTeam' : 'awayTeam'] = randomTeamName;
        divisionTheTeamPlaysIn = helpers.getDivisionTheTeamPlaysIn(this.teamsRemainingInCompetitionFlattened, randomTeamName);
        this.fixturesMadeByDraw[arrayIndex][this.counter%2 === 0 ? 'homeTeamDivision' : 'awayTeamDivision'] = divisionTheTeamPlaysIn;
        this.fixturesMadeByDraw[arrayIndex].dateOfFixture = DEFAULT_VALUE_COMPETITION_START_DATE;
        this.fixturesMadeByDraw[arrayIndex].timeOfFixture = DEFAULT_VALUE_COMPETITION_START_TIME;
        this.fixturesMadeByDraw[arrayIndex].hasFixtureFinished = false;
        this.fixturesMadeByDraw[arrayIndex].isReplay = false;

        this.latestTeamToBeDrawnNumber = randomTeamNumber;
        this.latestTeamToBeDrawn = randomTeamName;

        this.latestFixtureToBeDrawn = this.fixturesMadeByDraw[arrayIndex];

        if (divisionTheTeamPlaysIn === 'premierleague') debugger;

        // For the away team check to see if any of the teams is a Premier League team, and if so append the fixture to the array
        if (this.counter%2 !== 0 && (
            helpers.containsPremierLeague(this.fixturesMadeByDraw[arrayIndex].homeTeamDivision) || 
            helpers.containsPremierLeague(this.fixturesMadeByDraw[arrayIndex].awayTeamDivision))) {
                this.premierLeagueTeams.push(this.fixturesMadeByDraw[arrayIndex]);
        };

        // For the away team check to see if any of the teams is one of my watchlist teams, and if so append the fixture to the array
        // Convert this.fixturesMadeByDraw[arrayIndex] (an object) to an array as the areAnyMyWatchlistTeamsPlaying function requires this
        if (this.counter%2 !== 0 && helpers.areAnyMyWatchlistTeamsPlaying([this.fixturesMadeByDraw[arrayIndex]], this.props.myWatchlistTeams)) {
            this.myWatchlist.push(this.fixturesMadeByDraw[arrayIndex]);
        }

        this.setState({ teamsToBeDrawn: [...this.state.teamsToBeDrawn.slice(0, randomTeamNumber, 1), ...this.state.teamsToBeDrawn.slice(randomTeamNumber + 1)] });


        if (this.state.teamsToBeDrawn.length === 0) {
            clearInterval(this.updateInterval);
            this.latestTeamToBeDrawn = '';                  // Need to blank this otherwise the last team drawn shows a coloured ball at the end of the draw
            this.setState({ isDrawCompleted: true, startDrawButtonText: DRAW_COMPLETED, startDrawButtonEnabled: false });
            this.props.dispatch(updateDbsAndStoreAfterDraw(this.fixturesMadeByDraw));
            this.setState({ isDrawInProgress: false });
        }    
    }

    render() {

        const { teamsToBeDrawn, isDrawInProgress, isDrawCompleted, hasDrawBeenPaused, startDrawButtonText, startDrawButtonEnabled, dialogDrawCompletedIsOpen, drawUpdateInterval } = this.state;
        const { hasCompetitionFinished } = this.props;

        return (

            <div className="outer-container-draw">
                <div className={`container-main-content-draw ${hasCompetitionFinished ? 'competition-finished' : (isDrawCompleted ? 'drawComplete' : 'drawInProgress')}`}>
                    <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>

                    <Prompt when={isDrawInProgress} message="Are you sure you want to abandon the draw ?"/>

                    {!this.canTheDrawForThisCompetitionRoundProceed ?
                        <div className={`container-card draw ${hasCompetitionFinished ? 'competition-finished' : ''}`}>
                            <div className="main-header">
                                <div className="image-left"><img src={FOOTBALL_IMAGE} alt="" /></div>
                                <h1>{hasCompetitionFinished ? 'Competition Finished' : helpers.getCompetitionRoundHeader(this.competitionRound) + " Draw"}</h1>
                                <div className="image-right"><img src={FOOTBALL_IMAGE} alt="" /></div>
                            </div>
                            <div className="not-at-this-stage">{hasCompetitionFinished ? 'In order to play again, please reset the app via Settings' : 'The draw for this round cannot take place at this stage of the competition'}</div>
                        </div>
                        :
                        <Fragment>
                            <div className="container-card draw">

                                <Fragment>
                                    <ConfirmationDialog message="Draw has been completed" open={dialogDrawCompletedIsOpen} onClose={() => this.setState({ dialogDrawCompletedIsOpen: false })} />

                                    <div className="main-header">
                                    
                                        <div className="image-left"><img src={FOOTBALL_IMAGE} alt="" /></div>

                                        <h1>{helpers.getCompetitionRoundHeader(this.competitionRound) + " Draw"}</h1>

                                        <div className="image-right"><img src={FOOTBALL_IMAGE} alt="" /></div>

                                    </div>

                                    {!isDrawCompleted && <div className="draw-control-section">
                                        <div className="draw-update-button">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                id="startDraw"
                                                onClick={this.startDraw}
                                                // disabled={!this.authenticated || !startDrawButtonEnabled}
                                                disabled={!startDrawButtonEnabled}
                                                value={startDrawButtonText}
                                                >{startDrawButtonText}
                                            </Button>
                                        </div>

                                        <div className="draw-update-interval">
                                            <TextField
                                                id="drawUpdateInterval"
                                                label="Draw Update Interval (seconds)"
                                                placeholder="e.g. 0.5"
                                                className="form-control"
                                                fullWidth
                                                disabled={isDrawInProgress && !hasDrawBeenPaused}
                                                value={drawUpdateInterval}
                                                onChange={this.handleChangeDrawUpdateInterval()}
                                            />
                                        </div>
                                    </div>}

                                    <div className="Fixtures">                                    
                                        {this.fixturesMadeByDraw.map((fixture, i) => {
                                            return (
                                                <DrawTeam
                                                    key={i}
                                                    mainDraw={true}
                                                    fixture={fixture}
                                                    latestTeamToBeDrawnNumber={this.latestTeamToBeDrawnNumber}
                                                    latestTeamToBeDrawn={this.latestTeamToBeDrawn}
                                                />
                                            );
                                        })}
                                    </div>
                                </Fragment>

                            </div>
                            
                            <div className="secondary-information">
                            
                                {this.areAnyMyWatchlistTeamsInTheDraw &&
                                    <DrawMyWatchlist
                                        myWatchlist={this.myWatchlist}
                                        myWatchlistTeams={this.props.myWatchlistTeams}
                                        latestFixtureToBeDrawn={this.latestFixtureToBeDrawn}
                                    />
                                }

                                {this.competitionRound !== QUARTER_FINALS && this.competitionRound !== SEMI_FINALS && this.competitionRound !== FINAL && 
                                    <DrawPremierLeagueTeams
                                        premierLeagueTeams={this.premierLeagueTeams}
                                        latestFixtureToBeDrawn={this.latestFixtureToBeDrawn}
                                    />
                                }

                                {!isDrawCompleted &&
                                    <div className="container-card teams-to-be-drawn">

                                        <div className="main-header">
                                            <h1>Teams to be Drawn</h1>
                                        </div>

                                        <div className="teams">
                                            {teamsToBeDrawn.map(team => {
                                                return (
                                                    <div key={team.teamNumberInDraw} className="team">
                                                        <div className="teamNumberBlank">
                                                            <span className="teamNumberInDraw">{team.teamNumberInDraw + 1}</span>
                                                        </div>
                                                        <div className="teamAndDivision"><DrawTeamLabels team={team} positionAfter={true} /></div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                    </div>
                                }
                            </div>
                        </Fragment>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { hasCompetitionStarted, hasCompetitionFinished } = state.default.miscellaneous;
    return {
        miscellaneous: state.default.miscellaneous,
        fixturesForCompetition: state.default.fixturesForCompetition,
        teamsForCompetition: state.default.teamsForCompetition,
        myWatchlistTeams: state.default.myWatchlistTeams,
        hasCompetitionStarted,
        hasCompetitionFinished,
    }
}

Draw = connect(mapStateToProps, null)(Draw)

export default Draw;