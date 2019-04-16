import React from "react";
import PropTypes from 'prop-types';

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
                        />
                    )
                }
                return null;
            })}
        </div>
    </div>

)


PremierLeagueTeams.propTypes = {
    fixtures: PropTypes.array.isRequired,
    haveLatestFixturesStarted: PropTypes.bool.isRequired,
}

export default PremierLeagueTeams;
