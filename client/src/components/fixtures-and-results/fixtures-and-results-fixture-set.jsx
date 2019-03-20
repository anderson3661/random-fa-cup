import React, { Component, Fragment } from "react";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import FixtureRow from "../fixture-row/fixture-row";
import * as helpers from '../../utilities/helper-functions/helpers';

import { FOOTBALL_IMAGE } from '../../utilities/constants';

import "../../utilities/css/fixtures.scss";

class FixturesAndResultsFixtureSet extends Component {

    state = { showGoals: false }

    handleChangeShowGoals(e) { this.setState({showGoals: e.target.checked}) }

    render() {

        const { fixtures, teamsForCompetition, hasCompetitionStarted, displayFixtures, displayResults, displayHeader } = this.props;

        debugger;

        return (

            <div className="container-card fixtures-card">

                <div className={`main-header ${displayResults ? "displayResults" : ""} ${hasCompetitionStarted ? "" : "seasonsFixturesHaveNotBeenCreated"}`}>
                
                    <div className="image-left"><img src={FOOTBALL_IMAGE} alt="" /></div>

                    <h1>{displayHeader}</h1>

                    {(!(displayResults && hasCompetitionStarted) || fixtures.length === 0) && <div className="image-right"><img src={FOOTBALL_IMAGE} alt="" /></div>}

                    {displayResults && hasCompetitionStarted && fixtures.length > 0 && (
                        <div className="showGoals">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className="showGoalsText"
                                        checked={this.state.showGoals}
                                        onChange={this.handleChangeShowGoals.bind(this)}
                                        value={this.state.showGoals.toString()}
                                    />
                                }
                                label="Show Goals"
                            />                        
                        </div>
                    )}

                </div>

                {fixtures.length === 0 &&
                    <div className="not-at-this-stage">There are no results to display as the competition is not at this stage</div>
                }

                {hasCompetitionStarted && fixtures.length > 0 &&
                    <Fragment>
                        {/* <div className="fixtures-date">{fixtures.dateOfFixtures}</div> */}

                        <div className={`fixtures ${displayResults ? "results" : ""}`}>                                
                            {fixtures.map((fixture, i) => {
                                return (
                                    <FixtureRow
                                        key={i}
                                        fixture={fixture}
                                        displayResults = {displayResults}
                                        displayFixtures = {displayFixtures}
                                        showGoals={this.state.showGoals}
                                        homeTeamDivision={helpers.getDivisionTheTeamPlaysIn(teamsForCompetition, fixture.homeTeam)}
                                    />
                                );
                            })}
                        </div>
                    </Fragment>
                }
            </div>
        );
    }
}


export default FixturesAndResultsFixtureSet;