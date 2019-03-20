import React, { Component } from "react";
import Checkbox from '@material-ui/core/Checkbox';

import { DIVISIONS_HEADINGS } from '../../utilities/constants';
import { haveTeamValuesChanged, haveValidationErrorValuesChanged } from './administration-helpers';
import AdminFieldInput from './admin-field-input';
import * as helpers from '../../utilities/helper-functions/helpers';


class SettingsTeams extends Component {

    handleTeamsInputChange = (divisionIndex, teamIndex, updatedValue) => {
        this.props.onTeamsInputChange(divisionIndex, teamIndex, updatedValue);
    }

    handleTopTeamsInputChange = (divisionIndex, teamIndex, updatedValue) => {
        this.props.onTopTeamsInputChange(divisionIndex, teamIndex, updatedValue.target.checked);
    }

    // <td><input type="text" onChange={this.handleTeamsInputChange(divisionIndex, teamIndex, 'teamName')} value={team.teamName} /></td>
    // <td><input type="checkbox" onChange={this.handleTeamsInputChange(divisionIndex, teamIndex)} defaultChecked={team.isATopTeam} value={team.isATopTeam} /></td>

    // shouldComponentUpdate(nextProps) {
    //     return helpers.hasObjectValueChanged(this.props.teams, nextProps.teams, 'hasCompetitionStarted') ||
    //            haveTeamValuesChanged(this.props.teams, nextProps.teams) ||
    //            haveValidationErrorValuesChanged(this.props.teamsValidationErrors, nextProps.teamsValidationErrors);
    // }

    render() {

        const {hasCompetitionStarted, divisionIndex, teams, teamsValidationErrors} = this.props;

        return (
            
            <div key={divisionIndex} className="container-card">

                <h2>{ DIVISIONS_HEADINGS[divisionIndex] + ' Teams' }</h2>

                <table className="admin-teams">

                    <thead>
                        <tr className="teams-header">
                            <th className="admin-team-number">No.</th>
                            <th className="admin-team-team">Team</th>
                            <th className="admin-team-top-team">Top Team?</th>
                        </tr>
                    </thead>

                    <tbody>
                        {teams.map((team, teamIndex) => {
                            const teamsValidationError = teamsValidationErrors[teamIndex].errors;
                            return (
                                <tr key={teamIndex} className="team-row">
                                    <td className="admin-team-number">{teamIndex + 1}</td>

                                    <td>
                                        <AdminFieldInput
                                            name="teamName"
                                            value={team.teamName}
                                            disabled={hasCompetitionStarted}
                                            fullWidth={true}
                                            blockType={true}
                                            onChangeInputFieldValue={this.handleTeamsInputChange.bind(this, divisionIndex, teamIndex)}
                                        />
                                        {teamsValidationError && <div className="validation-error">{teamsValidationError}</div>}
                                    </td>

                                    <td className="admin-team-isATopTeam">
                                        <Checkbox
                                            className="admin-team-isATopTeam"
                                            checked={team.isATopTeam}
                                            disabled={hasCompetitionStarted}
                                            onChange={this.handleTopTeamsInputChange.bind(this, divisionIndex, teamIndex)}
                                            value={team.isATopTeam.toString()}
                                        />
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


export default SettingsTeams;