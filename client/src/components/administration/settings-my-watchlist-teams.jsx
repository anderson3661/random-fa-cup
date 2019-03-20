import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


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

    render() {

        const { hasCompetitionFinished, teamsForCompetitionFlattened, authenticated, myWatchlistTeams } = this.props;

        return (
            
            <div className="container-card">

                <h2>My Watchlist Teams</h2>
                <Button className="button-add-team" variant="contained" color="primary" id="addTeam" size="small" disabled={!authenticated || hasCompetitionFinished} onClick={this.handleAddTeam}>Add Team</Button>

                <table className="admin-teams">

                    <thead>
                        <tr className="teams-header">
                            <th className="admin-team-number">No.</th>
                            <th className="admin-team-team">Team</th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {myWatchlistTeams.map((team, teamIndex) => {
                            return (
                                <tr key={teamIndex} className="team-row">
                                    <td className="admin-team-number">{teamIndex + 1}</td>

                                    <td>
                                        <Select
                                            value={team.teamName}
                                            disabled={hasCompetitionFinished}
                                            onChange={this.handleMyWatchlistChangeTeam.bind(this, teamIndex)}
                                            >
                                            {teamsForCompetitionFlattened.map(team => (<MenuItem key={team.teamName} value={team.teamName}>{team.teamName}</MenuItem>))}
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


export default SettingsMyWatchlistTeams;