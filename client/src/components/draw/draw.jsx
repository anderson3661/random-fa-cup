import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import PropTypes from 'prop-types';

import { updateDbsAndStoreAfterDraw } from '../../redux/actions/drawActions';

import CompetitionFinishedOrWrongStage from '../common/competition-finished-or-wrong-stage';
import DrawHeader from "./draw-header";
import DrawFixtures from "./draw-fixtures";
import DrawMyWatchlist from "./draw-my-watchlist";
import DrawPremierLeagueTeams from "./draw-premier-league-teams";
import DrawTeamsToBeDrawn from "./draw-teams-to-be-drawn";
import Loading from '../loading/loading';
import * as helpers from '../../utilities/helper-functions/helpers';

import ConfirmationDialog from '../dialogs/confirmationDialog';

import { MAIN_BACKGROUND_IMAGE, FIRST_ROUND, SECOND_ROUND, QUARTER_FINALS, SEMI_FINALS, FINAL, DEFAULT_VALUE_COMPETITION_START_DATE, DEFAULT_VALUE_COMPETITION_START_TIME } from '../../utilities/constants';
import { LOADING } from '../../redux/actions/types';

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
            teamsToBeDrawn: this.teamsRemainingInCompetitionFlattened && this.teamsRemainingInCompetitionFlattened.map((team, i) => Object.assign({}, team, { teamNumberInDraw: i + 1})),
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
        debugger;
        if (!nextProps.loading && this.props.loading) {
            if (nextProps.loadingBackendError) {
                this.setState({ dialogLoadingBackendErrorConfirmIsOpen: true });     // If an error was encountered on the backend, then open the backend error dialog
            } else {
                this.setState({ dialogDrawCompletedIsOpen: true });
            }
        }
    }

    handleCloseDialogDrawCompleted = () => {
        this.setState({ dialogDrawCompletedIsOpen: false });
        helpers.goToTopOfPage();
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
        const divisionTheTeamPlaysIn = helpers.getDivisionTheTeamPlaysIn(this.teamsRemainingInCompetitionFlattened, randomTeamName);
        const isNewFixture = (this.counter % 2 === 0);
        const arrayIndex = Math.floor(this.counter / 2, 0);

        if (isNewFixture) {
            this.doesLatestFixtureToBeDrawnContainAPremierLeagueTeam = false;         
            this.doesLatestFixtureToBeDrawnContainAMyWatchlistTeam = false;
        }

        this.fixturesMadeByDraw[arrayIndex].competitionRound = this.competitionRound;
        this.fixturesMadeByDraw[arrayIndex][isNewFixture ? 'homeTeam' : 'awayTeam'] = randomTeamName;
        this.fixturesMadeByDraw[arrayIndex][isNewFixture ? 'homeTeamDivision' : 'awayTeamDivision'] = divisionTheTeamPlaysIn;
        this.fixturesMadeByDraw[arrayIndex].dateOfFixture = DEFAULT_VALUE_COMPETITION_START_DATE;
        this.fixturesMadeByDraw[arrayIndex].timeOfFixture = DEFAULT_VALUE_COMPETITION_START_TIME;
        this.fixturesMadeByDraw[arrayIndex].hasFixtureFinished = false;
        this.fixturesMadeByDraw[arrayIndex].isReplay = false;

        this.latestTeamToBeDrawnNumber = this.state.teamsToBeDrawn[randomTeamNumber].teamNumberInDraw;
        this.latestTeamToBeDrawn = randomTeamName;

        this.latestFixtureToBeDrawn = this.fixturesMadeByDraw[arrayIndex];

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
        this.props.loadingStart();                          // Start the loading indicator
        clearInterval(this.updateInterval);
        setTimeout(() => {
            this.latestTeamToBeDrawn = '';                  // Need to blank this otherwise the last team drawn shows a coloured ball at the end of the draw
            this.setState({ isDrawInProgress: false, isDrawCompleted: true, startDrawButtonText: DRAW_COMPLETED, startDrawButtonEnabled: false });
            this.props.updateDbsAndStoreAfterDraw(this.fixturesMadeByDraw, helpers.updateCompetitionRoundForNextDraw(this.competitionRound));
            this.displayCompletedDraw = true;
        }, Math.max(this.state.drawUpdateInterval * 1000, 1000));               // Wait for at least 1 second for the last team to be shown, before the draw refreshes (as it the scrolls to the top, or re-formats depending on which round is being drawn)
    }

    componentDidUpdate(prevProps, prevState) {
        // As the draw updates with each team, scroll the main Draw window (if applicable) to keep the latest drawn teams on screen

        if (prevState.teamsToBeDrawn.length > 0) {
            const counter = this.counter === 0 ? 0 : Math.round((this.counter + 1) / 2, 0);
            const div = document.querySelectorAll("div.draw-row")[[counter]];                       // Get the div of the fixture currently being drawn

            const divDraw = document.getElementById("draw");                                        // In the early rounds draw is used
            
            if (div && divDraw) {
                // console.log('divDraw.offsetTop', divDraw.offsetTop);            // The height of the main Draw div, used in case the user scrolls the draw right up to the top
                // console.log('window.screen.height', window.screen.height);      // The height of the screen resolution (e.g. 1200 for a 1600 x 1200 monitor) 
                // console.log('window.pageYOffset', window.pageYOffset);          // The amount of pixels the page has been vertically scrolled
                // console.log('div.offsetTop', div.offsetTop);                    // The position of the element (i.e. current team being drawn) from the top of the draw div (i.e. all teams drawn)

                if (this.counter % 2 === 0) {                                   // Scroll just before a new home team is added
                    if ((div.offsetTop - window.pageYOffset) > (window.screen.height - 250)) {
                        window.scrollBy(0, div.offsetTop - window.screen.height + 250 - window.pageYOffset );           // If the user has scrolled to the bottom and the current fixture is off the bottom of the screen, then scroll so that it re-appears
                    } else if (window.pageYOffset > 0 && (div.offsetTop - divDraw.offsetTop) < window.pageYOffset) {
                        if (prevState.teamsToBeDrawn.length !== 2) {                                                        // When the last team is drawn the screen jumps back to the top, so don't scroll
                            window.scrollBy(0, div.offsetTop - divDraw.offsetTop - window.pageYOffset - 75);                // If the user has scrolled to the top and the current fixture is off the top of the screen (or behind the scroll header), then scroll so that it re-appears
                        }
                    }
                }
            }

            helpers.scrollDiv(document.getElementById("myWatchlistTeams"));
            helpers.scrollDiv(document.getElementById("premierLeagueTeams"));
        }
    }


    render() {

        const { teamsToBeDrawn, isDrawInProgress, isDrawCompleted, hasDrawBeenPaused, startDrawButtonText, startDrawButtonEnabled, dialogDrawCompletedIsOpen, drawUpdateInterval } = this.state;
        const { loading, authenticated, hasCompetitionFinished, okToProceedWithDraw } = this.props;

        return (

            <div className="outer-container-draw">
                <div className={`container-main-content-draw${' '}${this.competitionRoundForCSS}${' '}
                                ${hasCompetitionFinished ? 'competition-finished' :
                                (!okToProceedWithDraw && !this.displayCompletedDraw ? 'not-at-this-stage' :
                                (isDrawCompleted ? 'drawComplete' : 'drawInProgress'))}`}>

                    <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>

                    { loading && <Loading /> }

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

                            <ConfirmationDialog message="Draw has been completed" open={dialogDrawCompletedIsOpen} onClose={this.handleCloseDialogDrawCompleted} />

                        </Fragment>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const { authenticated } = state.default.user;
    const { loading, loadingBackendError, hasCompetitionFinished, competitionRoundForNextDraw, okToProceedWithDraw } = state.default.miscellaneous;
    const drawUpdateInterval = state.default.settingsFactors.goalFactors.fixtureUpdateInterval;
    debugger;

    return {
        authenticated,
        loading, loadingBackendError, hasCompetitionFinished, competitionRoundForNextDraw, okToProceedWithDraw,
        drawUpdateInterval,
        fixturesForCompetition: state.default.fixturesForCompetition,
        teamsForCompetition: state.default.teamsForCompetition,
        myWatchlistTeams: state.default.myWatchlistTeams,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateDbsAndStoreAfterDraw: (fixturesMadeByDraw, updateCompetitionRoundForNextDraw) => dispatch(updateDbsAndStoreAfterDraw(fixturesMadeByDraw, updateCompetitionRoundForNextDraw)),
        loadingStart: () => dispatch({type: LOADING, data: { loading: true }}),
    }
}

Draw.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    loadingBackendError: PropTypes.bool.isRequired,
    hasCompetitionFinished: PropTypes.bool.isRequired,
    competitionRoundForNextDraw: PropTypes.string.isRequired,
    okToProceedWithDraw: PropTypes.bool.isRequired,
    drawUpdateInterval: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),          // User could decide to blank this, in which case it will be a string (and not required)
    fixturesForCompetition: PropTypes.array.isRequired,
    teamsForCompetition: PropTypes.array.isRequired,
    myWatchlistTeams: PropTypes.array.isRequired,
    updateDbsAndStoreAfterDraw: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Draw);
