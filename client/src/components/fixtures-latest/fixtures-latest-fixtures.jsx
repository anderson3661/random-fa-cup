import React from "react";

import FixtureRow from "../common/fixture-row";


const FixturesLatestFixtures = ({ fixtures, haveLatestFixturesStarted }) => (

    <div className="container-card fixtures">

        {/* <div className="fixtures-date">{this.formattedDateOfFixtures}</div> */}

        <div className="fixtures in-play">

            {fixtures.map((fixture, i) => {
                return (
                    <FixtureRow
                        key={i}                                        
                        fixture={fixture}
                        showForLatestFixtures={true}
                        haveLatestFixturesStarted={haveLatestFixturesStarted}
                        showGoals={false}
                        // top3TeamsBeforeFixtures={this.top3TeamsBeforeFixtures}
                    />
                )
            })}

        </div>

    </div>
)

export default FixturesLatestFixtures;