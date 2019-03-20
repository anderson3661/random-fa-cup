import React from "react";

import { COMPETITION_ROUNDS, DIVISIONS_ABBREVIATIONS } from '../../utilities/constants';
import * as helpers from '../../utilities/helper-functions/helpers';


const TeamsLeftByDivision = (props) => {

    const { teamsForCompetition, fixturesForCompetition, hasCompetitionStarted } = props;

    debugger;
    const competitionRoundIndex = (hasCompetitionStarted ? helpers.getLatestCompetitionRoundIndex(fixturesForCompetition) : 0);       // If there are no fixtures then use 0 to get all teams
    const competitionRound = COMPETITION_ROUNDS[competitionRoundIndex];
    const teamsRemainingInCompetitionByDivision = (competitionRoundIndex === -1 ? [] : helpers.getTeamsRemainingInCompetitionByDivision(teamsForCompetition, fixturesForCompetition, competitionRound));
    
    return (

            <div className="teams-left-by-division">

                <header>Teams Remaining</header>

                <table>
                    <tbody>
                        {DIVISIONS_ABBREVIATIONS.map((division, i) => {
                            return (
                                <tr key={i}>
                                    <td className="teamName">{division}</td>
                                    <td className="numberOfTeams">{helpers.getTeamsRemainingForDivision(teamsRemainingInCompetitionByDivision, division)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

            </div>
    );
}

export default TeamsLeftByDivision;