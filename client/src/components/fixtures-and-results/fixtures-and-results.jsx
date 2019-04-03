import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';

import CompetitionFinishedOrWrongStage from '../common/competition-finished-or-wrong-stage';
import FixturesAndResultsFixtureSet from "./fixtures-and-results-fixture-set";
import * as helpers from '../../utilities/helper-functions/helpers';

import { MAIN_BACKGROUND_IMAGE, COMPETITION_ROUNDS, COMPETITION_ROUNDS_FIXTURES } from '../../utilities/constants';

import "../../utilities/css/fixtures.scss";

class FixturesAndResults extends Component {

    componentDidMount() {
        // This is required by the links on the Home page (e.g. if user clicks on 1st Round Results, then scroll to the 1st round results)
        const divToGoTo = document.getElementById(this.props.competitionRoundToTop);
        if (divToGoTo) {
            divToGoTo.scrollIntoView();
            window.scrollBy(0, -125);           // Scroll up by 125 pixels so that the top of the container appears
        }
    }

    render() {
        let competitionRound;
        let index;
        let displayResultsForThisRound;
        let displayReplayResultsForThisRound;
        let fixturesToOutput = [];
        let replaysToOutput = [];
        let fixturesForCompetitionReversed;

        const { authenticated, fixturesForCompetition, teamsForCompetition, hasCompetitionStarted, hasCompetitionFinished } = this.props;

        fixturesForCompetitionReversed = [...fixturesForCompetition].reverse();

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

                        fixturesForCompetitionReversed.map((fixtures, i) => {
                            index = fixturesForCompetitionReversed.length - i - 1;     // As reversing the array need to get a descending index
                            competitionRound = COMPETITION_ROUNDS[index];
                            fixturesToOutput = fixtures[COMPETITION_ROUNDS_FIXTURES[index] + 'Fixtures'];
                            replaysToOutput = fixtures.replaysAllowed ? fixtures[COMPETITION_ROUNDS_FIXTURES[index] + 'Replays'] : replaysToOutput;
                            displayResultsForThisRound = (fixturesToOutput.length > 0 && fixturesToOutput.filter(fixture => fixture.hasFixtureFinished).length === fixturesToOutput.length);
                            displayReplayResultsForThisRound = (replaysToOutput.length > 0 && replaysToOutput.filter(fixture => fixture.hasFixtureFinished).length === replaysToOutput.length);
                            return (
                                <Fragment key={i}>
                                    {replaysToOutput.length > 0 &&
                                        <FixturesAndResultsFixtureSet
                                            fixtures={replaysToOutput}
                                            teamsForCompetition={teamsForCompetition}
                                            hasCompetitionStarted={hasCompetitionStarted}
                                            competitionRound={competitionRound}
                                            displayResults={displayReplayResultsForThisRound}
                                            displayHeader={helpers.getCompetitionRoundHeader(competitionRound) + (displayReplayResultsForThisRound ? ' Replay Results' : ' Replays')}
                                        />
                                    }

                                    {fixturesToOutput.length > 0 &&
                                        <FixturesAndResultsFixtureSet
                                            fixtures={fixturesToOutput}
                                            teamsForCompetition={teamsForCompetition}
                                            hasCompetitionStarted={hasCompetitionStarted}
                                            competitionRound={competitionRound}
                                            displayResults={displayResultsForThisRound}
                                            displayHeader={helpers.getCompetitionRoundHeader(competitionRound) + (displayResultsForThisRound ? ' ' + helpers.getResultsLabel(competitionRound) : ' Fixtures')}
                                        />
                                    }
                                </Fragment>
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    debugger;
    const { authenticated } = state.default.user;
    const { hasCompetitionStarted, hasCompetitionFinished } = state.default.miscellaneous;
    return {
        authenticated,
        fixturesForCompetition: state.default.fixturesForCompetition,
        teamsForCompetition: state.default.teamsForCompetition,
        hasCompetitionStarted,
        hasCompetitionFinished,
        competitionRoundToTop: ownProps.match ? ownProps.match.params.competitionRoundToTop : '',       // params is passed by links on the home page, but not if showing all results from the headings link
    }
}

export default connect(mapStateToProps, null)(FixturesAndResults);