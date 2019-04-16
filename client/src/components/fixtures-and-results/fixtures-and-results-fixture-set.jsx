import React, { Component } from "react";
import PropTypes from 'prop-types';

import FixtureRow from "../common/fixture-row";


class FixturesAndResultsFixtureSet extends Component {

    render() {

        const { fixtures, hasCompetitionStarted, competitionRound, displayResults, title, showGoals } = this.props;

        return (

            <div className={`container-card fixtures-card ${competitionRound}`} id={competitionRound}>

                <div className={`main-header ${displayResults ? "displayResults" : ""} ${hasCompetitionStarted ? "" : "seasonsFixturesHaveNotBeenCreated"}`}>
                
                    <h1>{title}</h1>

                </div>

                {fixtures.length === 0 &&
                    <div className="not-at-this-stage">There are no results to display as the competition is not at this stage</div>
                }

                {hasCompetitionStarted && fixtures.length > 0 &&
                    <div className={`fixtures ${displayResults ? "results" : ""}`}>                                
                        {fixtures.map((fixture, i) => {
                            return (
                                <FixtureRow
                                    key={i}
                                    fixture={fixture}
                                    showForFixturesAndResults = {true}
                                    showGoals={showGoals}
                                />
                            );
                        })}
                    </div>
                }
            </div>
        );
    }
}


FixturesAndResultsFixtureSet.propTypes = {
    fixtures: PropTypes.array.isRequired,
    hasCompetitionStarted: PropTypes.bool.isRequired,
    competitionRound: PropTypes.string.isRequired,
    displayResults: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    showGoals: PropTypes.bool.isRequired,
}

export default FixturesAndResultsFixtureSet;
