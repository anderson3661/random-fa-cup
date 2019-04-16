import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CompetitionFinishedOrWrongStage from '../common/competition-finished-or-wrong-stage';
import FixturesAndResultsHeader from "./fixtures-and-results-header";
import FixturesAndResultsFixtureSet from "./fixtures-and-results-fixture-set";
import RouteToThisStage from "../fixtures-latest/route-to-this-stage";
import * as helpers from '../../utilities/helper-functions/helpers';

import { MAIN_BACKGROUND_IMAGE, COMPETITION_ROUNDS, COMPETITION_ROUNDS_FIXTURES, DIVISIONS_HEADINGS } from '../../utilities/constants';

import "./fixtures-and-results.scss";

class FixturesAndResults extends Component {

    state = {
        showGoals: false,
        divisionSelected: '',
        teamSelected: '',
        myWatchlistTeamsSelected: false,
    }

    handleShowGoals = (value) => { this.setState({ showGoals: value }); }
    handleSelectDivision = (value) => { this.setState({ divisionSelected: value, teamSelected: '', myWatchlistTeamsSelected: false }); this.scrollToView(); }
    handleSelectTeam = (value) => { this.setState({ divisionSelected: '', teamSelected: value, myWatchlistTeamsSelected: false }); }
    handleSelectMyWatchlistTeams = (value) => { this.setState({ divisionSelected: '', teamSelected: '', myWatchlistTeamsSelected: value }); }

    componentDidMount() {
        // This is required by the links on the Home page (e.g. if user clicks on 1st Round Results, then scroll to the 1st round results)
        const divToGoTo = document.getElementById(this.props.competitionRoundToTop);
        if (divToGoTo) {
            divToGoTo.scrollIntoView();
            window.scrollBy(0, -300);           // Scroll up so that the top of the container appears
        }
    }

    scrollToView = () => {
        // This is required by the links on the Home page (e.g. if user clicks on 1st Round Results, then scroll to the 1st round results)
        helpers.goToTopOfPage();
        window.scrollBy(0, -300);           // Scroll up so that the top of the container appears
    }

    render() {
        let competitionRound;
        let index;
        let displayResultsForThisRound;
        let displayReplayResultsForThisRound;
        let fixturesToOutput = [];
        let replaysToOutput = [];

        const { showGoals, divisionSelected, teamSelected, myWatchlistTeamsSelected } = this.state;
        const { authenticated, hasCompetitionStarted, hasCompetitionFinished, fixturesForCompetition, fixturesForCompetitionReversed, myWatchlistTeams, selectDivisionOptions, selectTeamOptions } = this.props;

        return (

            <div className="outer-container-fixtures">
                <div className="container-main-content-fixtures-and-results">

                    <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>

                    {!authenticated ?
                        <CompetitionFinishedOrWrongStage
                            authenticated={authenticated}
                            hasCompetitionFinished={hasCompetitionFinished}
                            displayHeader="Fixtures and Results"
                            displayType="draw"
                        />

                        :

                        <Fragment>
                            <FixturesAndResultsHeader
                                hasCompetitionStarted={hasCompetitionStarted}
                                displayHeader="Fixtures and Results"
                                showGoals={showGoals}
                                divisionSelected={divisionSelected}
                                teamSelected={teamSelected}
                                myWatchlistTeamsSelected={myWatchlistTeamsSelected}
                                selectDivisionOptions={selectDivisionOptions}
                                selectTeamOptions={selectTeamOptions}
                                onShowGoals={this.handleShowGoals}
                                onSelectDivision={this.handleSelectDivision}
                                onSelectTeam={this.handleSelectTeam}
                                onSelectMyWatchlistTeams={this.handleSelectMyWatchlistTeams}
                            />

                            {teamSelected &&
                                <RouteToThisStage
                                    fixturesForCompetition={fixturesForCompetition}
                                    fixtureNumberForCSS={false}
                                    whichTeam={false}
                                    teamName={teamSelected}
                                    competitionRound=''
                                    showGoals={showGoals}
                                    displayHeader={false}
                                />
                            }

                            {!teamSelected && fixturesForCompetitionReversed.map((fixtures, i) => {
                                index = fixturesForCompetitionReversed.length - i - 1;     // As reversing the array need to get a descending index
                                competitionRound = COMPETITION_ROUNDS[index];

                                fixturesToOutput = fixtures[COMPETITION_ROUNDS_FIXTURES[index] + 'Fixtures'];
                                if (fixturesToOutput.length > 0) {
                                    if (divisionSelected) fixturesToOutput = helpers.filterFixturesByDivision(fixturesToOutput, divisionSelected);
                                    if (teamSelected) fixturesToOutput = helpers.filterFixturesByTeam(fixturesToOutput, teamSelected);
                                    if (myWatchlistTeamsSelected) fixturesToOutput = helpers.filterFixturesByMyWatchlistTeams(fixturesToOutput, myWatchlistTeams);
                                    fixturesToOutput = helpers.sortFixturesByHomeTeam(fixturesToOutput);
                                }

                                replaysToOutput = fixtures.replaysAllowed ? fixtures[COMPETITION_ROUNDS_FIXTURES[index] + 'Replays'] : replaysToOutput;
                                if (replaysToOutput.length > 0) {
                                    if (divisionSelected) replaysToOutput = helpers.filterFixturesByDivision(replaysToOutput, divisionSelected);
                                    if (teamSelected) replaysToOutput = helpers.filterFixturesByTeam(replaysToOutput, teamSelected);
                                    if (myWatchlistTeamsSelected) replaysToOutput = helpers.filterFixturesByMyWatchlistTeams(replaysToOutput, myWatchlistTeams);
                                    replaysToOutput = helpers.sortFixturesByHomeTeam(replaysToOutput);
                                }

                                displayResultsForThisRound = (fixturesToOutput.length > 0 && fixturesToOutput.filter(fixture => fixture.hasFixtureFinished).length === fixturesToOutput.length);
                                displayReplayResultsForThisRound = (replaysToOutput.length > 0 && replaysToOutput.filter(fixture => fixture.hasFixtureFinished).length === replaysToOutput.length);

                                return (
                                    <Fragment key={i}>
                                        {replaysToOutput.length > 0 &&
                                            <FixturesAndResultsFixtureSet
                                                fixtures={replaysToOutput}
                                                hasCompetitionStarted={hasCompetitionStarted}
                                                competitionRound={competitionRound}
                                                displayResults={displayReplayResultsForThisRound}
                                                title={helpers.getCompetitionRoundHeader(competitionRound) + (displayReplayResultsForThisRound ? ' Replay Results' : ' Replays')}
                                                showGoals={showGoals}
                                            />
                                        }

                                        {fixturesToOutput.length > 0 &&
                                            <FixturesAndResultsFixtureSet
                                                fixtures={fixturesToOutput}
                                                hasCompetitionStarted={hasCompetitionStarted}
                                                competitionRound={competitionRound}
                                                displayResults={displayResultsForThisRound}
                                                title={helpers.getCompetitionRoundHeader(competitionRound) + (displayResultsForThisRound ? ' ' + helpers.getResultsLabel(competitionRound) : ' Fixtures')}
                                                showGoals={showGoals}
                                            />
                                        }
                                    </Fragment>
                                )
                            })};
                        </Fragment>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { authenticated } = state.default.user;
    const { hasCompetitionStarted, hasCompetitionFinished } = state.default.miscellaneous;
    const { fixturesForCompetition, teamsForCompetition, myWatchlistTeams } = state.default;
    return {
        authenticated,
        hasCompetitionStarted, hasCompetitionFinished,
        fixturesForCompetition,
        fixturesForCompetitionReversed: [...fixturesForCompetition].reverse(),
        myWatchlistTeams,
        selectDivisionOptions: ["", ...DIVISIONS_HEADINGS].map(division => <option key={division} value={division}>{division}</option>),
        selectTeamOptions: ["", ...helpers.getTeamsForCompetitionFlattened(teamsForCompetition)].map(team => (<option key={team ? team.teamName : ''} value={team.teamName}>{team.teamName}</option>)),
        competitionRoundToTop: ownProps.match ? ownProps.match.params.competitionRoundToTop : '',       // params is passed by links on the home page, but not if showing all results from the headings link
    }
}

FixturesAndResults.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    hasCompetitionStarted: PropTypes.bool.isRequired,
    hasCompetitionFinished: PropTypes.bool.isRequired,
    fixturesForCompetition: PropTypes.array.isRequired,
    fixturesForCompetitionReversed: PropTypes.array.isRequired,
    myWatchlistTeams: PropTypes.array.isRequired,
    selectDivisionOptions: PropTypes.array.isRequired,
    selectTeamOptions: PropTypes.array.isRequired,
    competitionRoundToTop: PropTypes.string.isRequired,
}

export default connect(mapStateToProps, null)(FixturesAndResults);
