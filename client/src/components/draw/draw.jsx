import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { Prompt } from 'react-router';

import { updateDbsAndStoreAfterDraw } from '../../redux/actions/drawActions';

import CompetitionFinishedOrWrongStage from '../common/competition-finished-or-wrong-stage';
import DrawHeader from "./draw-header";
import DrawFixtures from "./draw-fixtures";
import DrawMyWatchlist from "./draw-my-watchlist";
import DrawPremierLeagueTeams from "./draw-premier-league-teams";
import DrawTeamsToBeDrawn from "./draw-teams-to-be-drawn";
import * as helpers from '../../utilities/helper-functions/helpers';

import ConfirmationDialog from '../dialogs/confirmationDialog';

import { MAIN_BACKGROUND_IMAGE, FIRST_ROUND, SECOND_ROUND, QUARTER_FINALS, SEMI_FINALS, FINAL, DEFAULT_VALUE_COMPETITION_START_DATE, DEFAULT_VALUE_COMPETITION_START_TIME } from '../../utilities/constants';

import "./draw.scss";

const PAUSE_DRAW = "Pause Draw";
const START_DRAW = "Start Draw";
const CONTINUE_DRAW = "Continue Draw";
const DRAW_COMPLETED = "Draw Completed";


class Draw extends Component {

    competitionRound;
    competitionRoundForCSS;
    teamsRemainingInCompetitionFlattened;
    updateInterval;
    fixturesMadeByDraw;
    counter;
    displayHeader;
    displayCompletedDraw;
    areAnyMyWatchlistTeamsInTheDraw;
    latestFixtureToBeDrawn;
    latestTeamToBeDrawn;
    latestTeamToBeDrawnNumber;
    doesLatestFixtureToBeDrawnContainAPremierLeagueTeam;
    doesLatestFixtureToBeDrawnContainAMyWatchlistTeam;
    myWatchlist = [];
    premierLeagueTeams = [];

    constructor(props) {
        super(props);

        this.handleStartDraw = this.handleStartDraw.bind(this);
        this.handleChangeDrawUpdateInterval = this.handleChangeDrawUpdateInterval.bind(this);

        const { authenticated, drawUpdateInterval, teamsForCompetition, myWatchlistTeams, fixturesForCompetition, hasCompetitionFinished, competitionRoundForNextDraw, okToProceedWithDraw } = this.props;

        this.competitionRound = competitionRoundForNextDraw;
        this.competitionRoundForCSS = helpers.getCompetitionRoundForCSS(this.competitionRound);
        this.displayCompletedDraw = false;

        if (okToProceedWithDraw) {            

            debugger;
            this.teamsRemainingInCompetitionFlattened = helpers.getTeamsRemainingInCompetitionFlattened(teamsForCompetition, fixturesForCompetition, this.competitionRound);

            if (this.teamsRemainingInCompetitionFlattened.length > 0) {

                this.counter = -1;

                this.fixturesMadeByDraw = [];
                for (let i = 0; i < this.teamsRemainingInCompetitionFlattened.length / 2; i++) {
                    this.fixturesMadeByDraw.push({});
                }
            }

        }

        this.displayHeader = (!authenticated ? 'Draw' : (hasCompetitionFinished ? 'Competition Finished' : helpers.getCompetitionRoundHeader(this.competitionRound) + " Draw"));

        this.state = {
            isDrawInProgress: false,
            isDrawCompleted: false,
            hasDrawBeenPaused: false,
            startDrawButtonEnabled: true,
            startDrawButtonText: START_DRAW,
            drawUpdateInterval: drawUpdateInterval,
            dialogDrawCompletedIsOpen: false,
            teamsToBeDrawn: this.teamsRemainingInCompetitionFlattened && this.teamsRemainingInCompetitionFlattened.map((team, i) => Object.assign({}, team, { teamNumberInDraw: i})),
        }

        if (this.state.teamsToBeDrawn) {
            this.areAnyMyWatchlistTeamsInTheDraw = helpers.areAnyMyWatchlistTeamsInTheDraw(this.state.teamsToBeDrawn, myWatchlistTeams);
        }
    }

    componentDidMount() {
        helpers.goToTopOfPage();
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

    handleChangeDrawUpdateInterval = (updatedValue) => {
        this.setState({ drawUpdateInterval: updatedValue });
    }

    handleStartDraw() {
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
        
        this.counter++;

        const randomTeamNumber = helpers.getRandomNumber(this.state.teamsToBeDrawn.length);
        const randomTeamName = this.state.teamsToBeDrawn[randomTeamNumber].teamName;
        const arrayIndex = Math.floor(this.counter / 2, 0);
        const divisionTheTeamPlaysIn = helpers.getDivisionTheTeamPlaysIn(this.teamsRemainingInCompetitionFlattened, randomTeamName);

        if (this.counter%2 === 0) {                                                  // Start of a new fixture                   
            this.doesLatestFixtureToBeDrawnContainAPremierLeagueTeam = false;         
            this.doesLatestFixtureToBeDrawnContainAMyWatchlistTeam = false;
        }

        this.fixturesMadeByDraw[arrayIndex].competitionRound = this.competitionRound;
        this.fixturesMadeByDraw[arrayIndex][this.counter%2 === 0 ? 'homeTeam' : 'awayTeam'] = randomTeamName;
        this.fixturesMadeByDraw[arrayIndex][this.counter%2 === 0 ? 'homeTeamDivision' : 'awayTeamDivision'] = divisionTheTeamPlaysIn;
        this.fixturesMadeByDraw[arrayIndex].dateOfFixture = DEFAULT_VALUE_COMPETITION_START_DATE;
        this.fixturesMadeByDraw[arrayIndex].timeOfFixture = DEFAULT_VALUE_COMPETITION_START_TIME;
        this.fixturesMadeByDraw[arrayIndex].hasFixtureFinished = false;
        this.fixturesMadeByDraw[arrayIndex].isReplay = false;

        this.latestTeamToBeDrawnNumber = randomTeamNumber;
        this.latestTeamToBeDrawn = randomTeamName;

        this.latestFixtureToBeDrawn = this.fixturesMadeByDraw[arrayIndex];

        if (divisionTheTeamPlaysIn === 'premierleague') debugger;

        // If the flag has not already been set (i.e. in case where away team is drawn) check to see if the team just drawn is in the Premier League, and if so append the fixture to the array
        if (!this.doesLatestFixtureToBeDrawnContainAPremierLeagueTeam && helpers.containsPremierLeague(divisionTheTeamPlaysIn)) {
            this.doesLatestFixtureToBeDrawnContainAPremierLeagueTeam = true;
            this.premierLeagueTeams.push(this.fixturesMadeByDraw[arrayIndex]);
        }

        // If the flag has not already been set (i.e. in case where away team is drawn) check to see if the team just drawn is one of My Watchlist teams, and if so append the fixture to the array
        if (!this.doesLatestFixtureToBeDrawnContainAMyWatchlistTeam && helpers.areAnyMyWatchlistTeamsPlaying([this.fixturesMadeByDraw[arrayIndex]], this.props.myWatchlistTeams)) {
            this.doesLatestFixtureToBeDrawnContainAMyWatchlistTeam = true;
            this.myWatchlist.push(this.fixturesMadeByDraw[arrayIndex]);
        }

        this.setState({ teamsToBeDrawn: [...this.state.teamsToBeDrawn.slice(0, randomTeamNumber, 1), ...this.state.teamsToBeDrawn.slice(randomTeamNumber + 1)] });


        if (this.state.teamsToBeDrawn.length === 0) {
            this.tidyUpAfterDrawHasFinished();
        }    
    }

    tidyUpAfterDrawHasFinished = () => {
        clearInterval(this.updateInterval);
        this.latestTeamToBeDrawn = '';                  // Need to blank this otherwise the last team drawn shows a coloured ball at the end of the draw
        this.setState({ isDrawInProgress: false, isDrawCompleted: true, startDrawButtonText: DRAW_COMPLETED, startDrawButtonEnabled: false });
        this.props.dispatch(updateDbsAndStoreAfterDraw(this.fixturesMadeByDraw, helpers.updateCompetitionRoundForNextDraw(this.competitionRound)));
        helpers.goToTopOfPage();
        this.displayCompletedDraw = true;
    }

    componentDidUpdate(prevProps, prevState) {
        // Scroll to the bottom of the main Draw window as it updates with each team
        // console.log('div.clientHeight', div.clientHeight);
        // console.log('div.offsetTop', div.offsetTop);
        // console.log('window.screen.height', window.screen.height);
        // console.log('window.screenX', window.screenX);
        const counter = this.counter === 0 ? 0 : Math.round((this.counter + 1) / 2, 0);
        // const divDraw = document.getElementById("draw");
        const div = document.querySelectorAll("div.draw-row")[[counter]];

        // console.log(window.pageXOffset);
        // console.log(window.pageYOffset);
        // console.log(div.scrollLeft);
        // console.log(div.scrollLeft);
        // console.log(divDraw.offsetTop);
        // console.log(div.scrollHeight);
        // console.log(div.clientHeight);
        // console.log(divDraw.scrollHeight);

        debugger;

        if (div) {
            const rect = div.getBoundingClientRect();
            // console.log('rect.top', rect.top);
            // div.offsetTop is the position of the element (i.e. current team being drawn) from the top of the draw div (i.e. all teams drawn)
            // console.log(div.offsetTop);
            if (this.counter%2 === 0) {                                      // Scroll just before a new home team is added
                // if (window.screen.height - div.offsetTop < 500) {
                if (rect.top > (window.screen.height - 250)) {
                    window.scrollBy(0, div.clientHeight);
                } else if (rect.top > 1000) {
                    window.scrollTo(1000);
                }
            }
        }


        helpers.scrollDiv(document.getElementById("myWatchlistTeams"));
        helpers.scrollDiv(document.getElementById("premierLeagueTeams"));
    }


    render() {

        const { teamsToBeDrawn, isDrawInProgress, isDrawCompleted, hasDrawBeenPaused, startDrawButtonText, startDrawButtonEnabled, dialogDrawCompletedIsOpen, drawUpdateInterval } = this.state;
        const { authenticated, hasCompetitionFinished, okToProceedWithDraw } = this.props;

        return (

            <div className="outer-container-draw">
                <div className={`container-main-content-draw${' '}${this.competitionRoundForCSS}${' '}
                                ${hasCompetitionFinished ? 'competition-finished' :
                                (!okToProceedWithDraw && !this.displayCompletedDraw ? 'not-at-this-stage' :
                                (isDrawCompleted ? 'drawComplete' : 'drawInProgress'))}`}>

                    <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>

                    <Prompt when={isDrawInProgress} message="Are you sure you want to abandon the draw ?"/>

                    {!authenticated || (!okToProceedWithDraw && !this.displayCompletedDraw) ?
                        <CompetitionFinishedOrWrongStage
                            authenticated={authenticated}
                            hasCompetitionFinished={hasCompetitionFinished}
                            displayHeader={this.displayHeader}
                            displayType="draw"
                        />

                        :

                        <Fragment>
                            <div className={`container-card draw-header ${isDrawInProgress ? 'draw-in-progress' : ''}`}>

                                <DrawHeader
                                    authenticated={authenticated}
                                    isDrawInProgress={isDrawInProgress}
                                    hasDrawBeenPaused={hasDrawBeenPaused}
                                    isDrawCompleted={isDrawCompleted}
                                    displayHeader={this.displayHeader}
                                    startDrawButtonText = {startDrawButtonText}
                                    startDrawButtonEnabled = {startDrawButtonEnabled}
                                    drawUpdateInterval = {drawUpdateInterval}
                                    onClickStartDraw = {this.handleStartDraw}
                                    onChangeDrawUpdateInterval = {this.handleChangeDrawUpdateInterval}
                                />

                                {(isDrawCompleted || (this.competitionRound !== FIRST_ROUND && this.competitionRound !== SECOND_ROUND)) &&
                                    <DrawFixtures fixturesMadeByDraw={this.fixturesMadeByDraw} latestTeamToBeDrawnNumber={this.latestTeamToBeDrawnNumber} latestTeamToBeDrawn={this.latestTeamToBeDrawn} />
                                }

                            </div>

                            {!isDrawCompleted && (this.competitionRound === FIRST_ROUND || this.competitionRound === SECOND_ROUND) &&
                                <Fragment>
                                    <div className="filler-for-scroll"></div>
                                    <div className="container-card draw" id="draw">
                                        <DrawFixtures fixturesMadeByDraw={this.fixturesMadeByDraw} latestTeamToBeDrawnNumber={this.latestTeamToBeDrawnNumber} latestTeamToBeDrawn={this.latestTeamToBeDrawn} />
                                    </div>
                                </Fragment>
                            }
                            
                            <div className="secondary-information">
                            
                                {this.competitionRound !== QUARTER_FINALS && this.competitionRound !== SEMI_FINALS && this.competitionRound !== FINAL &&
                                 this.areAnyMyWatchlistTeamsInTheDraw &&
                                    <DrawMyWatchlist
                                        myWatchlist={this.myWatchlist}
                                        myWatchlistTeams={this.props.myWatchlistTeams}
                                        doesLatestFixtureToBeDrawnContainAMyWatchlistTeam={this.doesLatestFixtureToBeDrawnContainAMyWatchlistTeam}
                                    />
                                }

                                {this.competitionRound !== QUARTER_FINALS && this.competitionRound !== SEMI_FINALS && this.competitionRound !== FINAL && 
                                    <DrawPremierLeagueTeams
                                        premierLeagueTeams={this.premierLeagueTeams}
                                        doesLatestFixtureToBeDrawnContainAPremierLeagueTeam={this.doesLatestFixtureToBeDrawnContainAPremierLeagueTeam}
                                    />
                                }

                                {!isDrawCompleted && <DrawTeamsToBeDrawn teamsToBeDrawn={teamsToBeDrawn} />}

                            </div>

                            <ConfirmationDialog message="Draw has been completed" open={dialogDrawCompletedIsOpen} onClose={() => this.setState({ dialogDrawCompletedIsOpen: false })} />

                        </Fragment>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { authenticated } = state.default.user;
    const { hasCompetitionFinished, competitionRoundForNextDraw, okToProceedWithDraw } = state.default.miscellaneous;
    debugger;
    return {
        authenticated,
        miscellaneous: state.default.miscellaneous,
        drawUpdateInterval: state.default.settingsFactors.goalFactors.fixtureUpdateInterval,
        fixturesForCompetition: state.default.fixturesForCompetition,
        teamsForCompetition: state.default.teamsForCompetition,
        myWatchlistTeams: state.default.myWatchlistTeams,
        hasCompetitionFinished,
        competitionRoundForNextDraw,
        okToProceedWithDraw,
    }
}

export default connect(mapStateToProps, null)(Draw);