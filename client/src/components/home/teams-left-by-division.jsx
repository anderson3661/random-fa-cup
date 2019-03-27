import React from "react";

import * as helpers from '../../utilities/helper-functions/helpers';


const TeamsLeftByDivision = (props) => {

    const { teamsRemainingInCompetitionByDivision } = props;
    
    return (

            <div className="teams-left-by-division">

                <header>Teams Remaining</header>

                <table>
                    <tbody>
                        {teamsRemainingInCompetitionByDivision.map((division, i) => {
                            return (
                                <tr key={i}>
                                    <td className="divisionName">{helpers.getDivisionAbbreviation(division.name)}</td>
                                    <td className="numberOfTeams">{division.numberOfTeams}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

            </div>
    );
}

export default TeamsLeftByDivision;