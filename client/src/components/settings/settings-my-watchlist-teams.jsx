import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';

import * as helpers from '../../utilities/helper-functions/helpers';
import { areThereAnyChangesToMyWatchlistTeamValues } from './settings-helpers';


class SettingsMyWatchlistTeams extends Component {

    handleAddTeam = () => {
        this.props.onMyWatchlistTeamsAddTeam();
    }
    
    handleMyWatchlistChangeTeam = (teamIndex, e) => {
        this.props.onMyWatchlistTeamsChangeTeam(teamIndex, e.target.value);
    }
    
    handleDeleteTeam = (teamIndex) => {
        this.props.onMyWatchlistTeamsDeleteTeam(teamIndex);
    }

    shouldComponentUpdate(nextProps) {
        return helpers.hasObjectValueChanged(this.props, nextProps, 'authenticated') ||
               helpers.hasObjectValueChanged(this.props, nextProps, 'hasCompetitionFinished') ||
               areThereAnyChangesToMyWatchlistTeamValues(this.props.myWatchlistTeams, nextProps.myWatchlistTeams)
    }

    render() {
        const { authenticated, hasCompetitionFinished, teamsForCompetitionSelectOptions, myWatchlistTeams } = this.props;

        return (
            
            <div className="container-card">

                <h2>My Watchlist Teams</h2>
                <Button className="button-add-team" variant="contained" color="primary" id="addTeam" size="small" disabled={!authenticated || hasCompetitionFinished} onClick={this.handleAddTeam}>Add Team</Button>

                <table className="settings-teams">

                    <thead>
                        <tr className="teams-header">
                            <th className="settings-team-number">No.</th>
                            <th className="settings-team-team">Team</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {myWatchlistTeams.map((team, teamIndex) => {
                            return (
                                <tr key={teamIndex} className="team-row">
                                    <td className="settings-team-number">{teamIndex + 1}</td>

                                    <td>
                                        <Select
                                            value={team.teamName}
                                            disabled={hasCompetitionFinished}
                                            onChange={this.handleMyWatchlistChangeTeam.bind(this, teamIndex)}
                                            native={true}
                                            >
                                            {teamsForCompetitionSelectOptions}
                                        </Select>
                                    </td>

                                    <td>
                                        <Button variant="contained" color="secondary" id="deleteTeam" size="small" disabled={hasCompetitionFinished} onClick={this.handleDeleteTeam.bind(this, teamIndex)}>Delete Team</Button>
                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}


SettingsMyWatchlistTeams.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    hasCompetitionFinished: PropTypes.bool.isRequired,
    teamsForCompetitionSelectOptions: PropTypes.array.isRequired,
    myWatchlistTeams: PropTypes.array.isRequired,
    onMyWatchlistTeamsAddTeam: PropTypes.func.isRequired,
    onMyWatchlistTeamsChangeTeam: PropTypes.func.isRequired,
    onMyWatchlistTeamsDeleteTeam: PropTypes.func.isRequired,
}

export default SettingsMyWatchlistTeams;
