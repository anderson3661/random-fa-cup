import React from "react";

import FixtureRow from "../common/fixture-row";

import { DIVISIONS } from '../../utilities/constants';


const PremierLeagueTeams = ({ fixtures, haveLatestFixturesStarted }) => (

    <div className="container-card premier-league-teams">
        <h2>Premier League Teams</h2>

        <div className="fixtures premier-league-teams">
            {fixtures.map((fixture, i) => {
                if (fixture.homeTeamDivision === DIVISIONS[0] || fixture.awayTeamDivision === DIVISIONS[0]) {
                    return (
                        <FixtureRow
                            key={i}                                        
                            fixture={fixture}
                            showForLatestFixtures={true}
                            haveLatestFixturesStarted={haveLatestFixturesStarted}
                            showGoals={false}
                            showVersus={true}
                            // top3TeamsBeforeFixtures={this.top3TeamsBeforeFixtures}
                        />
                    )
                }
                return null;
            })}
        </div>
    </div>

)

export default PremierLeagueTeams;