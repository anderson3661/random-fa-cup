import React, { Fragment } from "react";

import './fixtures-row-penalties.scss';


const FixtureRowPenalties = ({ penalties, homeTeamsScorePenalties, awayTeamsScorePenalties }) => (

    <Fragment>
        <div className="fixtures-row-penalties-summary">
            <div className="teamScorePenalties homeTeam">{ homeTeamsScorePenalties }</div>
            <div className="penaltiesInfo">Penalties</div>
            <div className="teamScorePenalties awayTeam">{ awayTeamsScorePenalties }</div>
        </div>

        {penalties.map((penalty, i) => {
            return (
                <div key={i} className="fixtures-row-penalties">
                    <div className="penalty homeTeam">{ penalty.hasHomeTeamScored ? "Goal" : "Miss" }</div>
                    <div className="penalty number">Penalty { i + 1 }</div>
                    <div className="penalty awayTeam">{ penalty.hasAwayTeamScored ? "Goal" : "Miss" }</div>
                </div>
            )
        })}
    </Fragment>
)
    

export default FixtureRowPenalties;