import React, { Component } from "react";
import PropTypes from 'prop-types';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { FOOTBALL_IMAGE } from '../../utilities/constants';


class FixturesAndResultsHeader extends Component {

    handleChangeShowGoals(e) { this.props.onShowGoals(e.target.checked); }
    handleSelectDivision = (e) => { this.props.onSelectDivision(e.target.value); }
    handleSelectTeam = (e) => { this.props.onSelectTeam(e.target.value); }
    handleSelectMyWatchlistTeams = (e) => { this.props.onSelectMyWatchlistTeams(e.target.checked); }

    render() {

        const { hasCompetitionStarted, displayHeader, showGoals, divisionSelected, teamSelected, myWatchlistTeamsSelected, selectDivisionOptions, selectTeamOptions } = this.props;

        return (

            <div className="container-card fixtures-card-main-header">

                <div className="filler-for-scroll"></div>

                <div className={`main-header ${hasCompetitionStarted ? "" : "seasonsFixturesHaveNotBeenCreated"}`}>
                
                    <div className="image-left"><img src={FOOTBALL_IMAGE} alt="" /></div>

                    <h1>{displayHeader}</h1>

                    {(!hasCompetitionStarted) && <div className="image-right"><img src={FOOTBALL_IMAGE} alt="" /></div>}

                    {hasCompetitionStarted && (
                        <div className="showGoals">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        className="showGoalsText"
                                        checked={showGoals}
                                        onChange={this.handleChangeShowGoals.bind(this)}
                                        value={showGoals.toString()}
                                    />
                                }
                                label="Show Goals"
                            />                        
                        </div>
                    )}

                </div>

                <div className="select-options">

                    <div className="select-division">
                        <span>Select Division</span>
                        <Select
                            value={divisionSelected}
                            disabled={false}
                            onChange={this.handleSelectDivision}
                            native={true}
                            >
                            {selectDivisionOptions}
                        </Select>
                    </div>

                    <div className="select-team">
                        <span>Select Team</span>
                        <Select
                            value={teamSelected}
                            disabled={false}
                            onChange={this.handleSelectTeam}
                            native={true}
                            >
                            {selectTeamOptions}
                        </Select>
                    </div>

                    <div className="select-my-watchlist-teams">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    className="myWatchlistTeamsText"
                                    checked={myWatchlistTeamsSelected}
                                    onChange={this.handleSelectMyWatchlistTeams.bind(this)}
                                    value={myWatchlistTeamsSelected.toString()}
                                />
                            }
                            label="Select My Watchlist Teams"
                        />                        
                    </div>

                </div>

                {hasCompetitionStarted && false &&
                    <div className="not-at-this-stage">There are no results to display as the competition is not at this stage</div>
                }

            </div>
        );
    }
}


FixturesAndResultsHeader.propTypes = {
    hasCompetitionStarted: PropTypes.bool.isRequired,
    displayHeader: PropTypes.string.isRequired,
    showGoals: PropTypes.bool.isRequired,
    divisionSelected: PropTypes.string.isRequired,
    teamSelected: PropTypes.string.isRequired,
    myWatchlistTeamsSelected: PropTypes.bool.isRequired,
    selectDivisionOptions: PropTypes.array.isRequired,
    selectTeamOptions: PropTypes.array.isRequired,
}

export default FixturesAndResultsHeader;
