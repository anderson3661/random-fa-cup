import React from "react";
import PropTypes from 'prop-types';

import FixtureRow from "../common/fixture-row";


const FixturesLatestFixtures = ({ fixtures, haveLatestFixturesStarted }) => (

    <div className="container-card fixtures">

        <div className="fixtures in-play">

            {fixtures.map((fixture, i) => {
                return (
                    <FixtureRow
                        key={i}                                        
                        fixture={fixture}
                        showForLatestFixtures={true}
                        haveLatestFixturesStarted={haveLatestFixturesStarted}
                        showGoals={false}
                    />
                )
            })}

        </div>

    </div>
)


FixturesLatestFixtures.propTypes = {
    fixtures: PropTypes.array.isRequired,
    haveLatestFixturesStarted: PropTypes.bool.isRequired,
}

export default FixturesLatestFixtures;
