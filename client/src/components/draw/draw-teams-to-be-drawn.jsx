import React from "react";
import PropTypes from 'prop-types';

import TeamLabels from "../common/team-labels";


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
                            <span className="teamNumberInDraw">{team.teamNumberInDraw}</span>
                        </div>
                        <div className="teamAndDivision"><TeamLabels team={team} positionAfter={true} /></div>
                    </div>
                );
            })}
        </div>

    </div>
)


DrawTeamsToBeDrawn.propTypes = {
    teamsToBeDrawn: PropTypes.array.isRequired,
}

export default DrawTeamsToBeDrawn;
