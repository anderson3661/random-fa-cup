import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';

import FixturesAndResultsFixtureSet from "./fixtures-and-results-fixture-set";
import * as helpers from '../../utilities/helper-functions/helpers';

import { MAIN_BACKGROUND_IMAGE, COMPETITION_ROUNDS, COMPETITION_ROUNDS_FIXTURES } from '../../utilities/constants';

import "../../utilities/css/fixtures.scss";

class FixturesAndResults extends Component {

    componentDidMount() {
        helpers.goToTopOfPage();
    }

    render() {
        let competitionRound;
        let index;
        let displayResultsForThisRound;
        let displayReplayResultsForThisRound;
        let fixturesToOutput = [];
        let replaysToOutput = [];
        let fixturesForCompetitionReversed;

        const { fixturesForCompetition, teamsForCompetition, hasCompetitionStarted } = this.props;

        fixturesForCompetitionReversed = [...fixturesForCompetition].reverse();

        return (

            <div className="outer-container-fixtures">
                <div className="container-main-content-fixtures">
                    <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>

                    {fixturesForCompetitionReversed.map((fixtures, i) => {
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
                                        displayFixtures={!displayReplayResultsForThisRound}
                                        displayResults={displayReplayResultsForThisRound}
                                        displayHeader={helpers.getCompetitionRoundHeader(competitionRound) + (displayReplayResultsForThisRound ? ' Replay Results' : ' Replays')}
                                    />
                                }

                                {fixturesToOutput.length > 0 &&
                                    <FixturesAndResultsFixtureSet
                                        fixtures={fixturesToOutput}
                                        teamsForCompetition={teamsForCompetition}
                                        hasCompetitionStarted={hasCompetitionStarted}
                                        displayFixtures={!displayResultsForThisRound}
                                        displayResults={displayResultsForThisRound}
                                        displayHeader={helpers.getCompetitionRoundHeader(competitionRound) + (displayResultsForThisRound ? ' Results' : ' Fixtures')}
                                    />
                                }
                            </Fragment>
                        )
                    })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    debugger;
    const { hasCompetitionStarted, hasCompetitionFinished } = state.default.miscellaneous;
    return {
        fixturesForCompetition: state.default.fixturesForCompetition,
        teamsForCompetition: state.default.teamsForCompetition,
        hasCompetitionStarted,
        hasCompetitionFinished,
    }
}

export default connect(mapStateToProps, null)(FixturesAndResults);