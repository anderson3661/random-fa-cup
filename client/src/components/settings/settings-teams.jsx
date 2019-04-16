import React, { Component } from "react";
import PropTypes from 'prop-types';
// import Checkbox from '@material-ui/core/Checkbox';

import { DIVISIONS_HEADINGS } from '../../utilities/constants';
// import SettingsFieldInput from './settings-field-input';
// import FieldInput from './settings-crud-field-input';
import * as helpers from '../../utilities/helper-functions/helpers';
import { haveTeamValuesChanged, haveValidationErrorValuesChanged } from './settings-helpers';

class SettingsTeams extends Component {

    handleTeamsInputChange = (divisionIndex, teamIndex, updatedValue) => {
        // If using native HTML inputs then updatedValue will return an event object; if using Material UI then updatedValue returns a string
        this.props.onTeamsInputChange(divisionIndex, teamIndex, updatedValue.target ? updatedValue.target.value : updatedValue);
    }

    handleTopTeamsInputChange = (divisionIndex, teamIndex, updatedValue) => {
        this.props.onTopTeamsInputChange(divisionIndex, teamIndex, updatedValue.target.checked);
    }

    shouldComponentUpdate(nextProps) {
        return helpers.hasObjectValueChanged(this.props, nextProps, 'hasCompetitionStarted') ||
               haveTeamValuesChanged(this.props.teams, nextProps.teams) ||
               haveValidationErrorValuesChanged(this.props.teamsValidationErrors, nextProps.teamsValidationErrors);
    }

    render() {
        const {hasCompetitionStarted, divisionIndex, teams, teamsValidationErrors} = this.props;

        return (
            
            <div key={divisionIndex} className="container-card">

                <h2>{ DIVISIONS_HEADINGS[divisionIndex] + ' Teams' }</h2>

                <table className="settings-teams">

                    <thead>
                        <tr className="teams-header">
                            <th className="settings-team-number">No.</th>
                            <th className="settings-team-team">Team</th>
                            <th className="settings-team-top-team">Top Team?</th>
                        </tr>
                    </thead>

                    <tbody>
                        {teams.map((team, teamIndex) => {
                            const teamsValidationError = teamsValidationErrors[teamIndex].errors;
                            return (
                                <tr key={teamIndex} className="team-row">
                                    <td className="settings-team-number">{teamIndex + 1}</td>

                                    <td>
                                        {divisionIndex >= 0 &&
                                            <input
                                                className="team-name"
                                                type="text"
                                                value={team.teamName}
                                                disabled={hasCompetitionStarted}
                                                onChange={this.handleTeamsInputChange.bind(this, divisionIndex, teamIndex)}
                                            />
                                        }

                                        {teamsValidationError && <div className="validation-error">{teamsValidationError}</div>}

                                        {/* Would like to use Material UI, but with all the team names and checkboxes the application is too slow with all of the extra code */}
                                        {/* {divisionIndex === 0 &&
                                            <SettingsFieldInput
                                                name="teamName"
                                                value={team.teamName}
                                                disabled={hasCompetitionStarted}
                                                fullWidth={true}
                                                blockType={true}
                                                updateField={this.handleTeamsInputChange.bind(this, divisionIndex, teamIndex)}
                                                // onChangeInputFieldValue={this.handleTeamsInputChange.bind(this, divisionIndex, teamIndex)}
                                            />
                                        } */}
                                        
                                    </td>

                                    <td className="settings-team-isATopTeam">

                                        {divisionIndex >= 0 &&
                                            <input
                                                className="is-a-top-team"
                                                type="checkbox"
                                                defaultChecked={team.isATopTeam}
                                                value={team.isATopTeam}
                                                disabled={hasCompetitionStarted}
                                                onChange={this.handleTopTeamsInputChange.bind(this, divisionIndex, teamIndex)}
                                            />
                                        }

                                        {/* Would like to use Material UI, but with all the team names and checkboxes the application is too slow with all of the extra code */}
                                        {/* {divisionIndex === 0 &&
                                            <Checkbox
                                                className="settings-team-isATopTeam"
                                                checked={team.isATopTeam}
                                                disabled={hasCompetitionStarted}
                                                onChange={this.handleTopTeamsInputChange.bind(this, divisionIndex, teamIndex)}
                                                value={team.isATopTeam.toString()}
                                            />
                                        } */}
                                       
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


SettingsTeams.propTypes = {
    hasCompetitionStarted: PropTypes.bool.isRequired,
    divisionIndex: PropTypes.number.isRequired,
    teams: PropTypes.array.isRequired,
    teamsValidationErrors: PropTypes.array.isRequired,
    onTeamsInputChange: PropTypes.func.isRequired,
    onTopTeamsInputChange: PropTypes.func.isRequired,
}

export default SettingsTeams;
