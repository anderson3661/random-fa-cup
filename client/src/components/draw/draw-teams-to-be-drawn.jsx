import React from "react";

import DrawTeamLabels from "./draw-team-labels";


const DrawTeamsToBeDrawn = ({ teamsToBeDrawn }) => (

    <div className="container-card teams-to-be-drawn">

        <div className="main-header">
            <h1>Teams to be Drawn</h1>
        </div>

        <div className="teams">
            {teamsToBeDrawn.map(team => {
                return (
                    <div key={team.teamNumberInDraw} className="team">
                        <div className="teamNumberBlank">
                            <span className="teamNumberInDraw">{team.teamNumberInDraw + 1}</span>
                        </div>
                        <div className="teamAndDivision"><DrawTeamLabels team={team} positionAfter={true} /></div>
                    </div>
                );
            })}
        </div>

    </div>
)

export default DrawTeamsToBeDrawn;