import React from "react";
import PropTypes from 'prop-types';

import FixtureRow from "../common/fixture-row";

import * as helpers from '../../utilities/helper-functions/helpers';


const CupUpsets = ({ teamsForCompetition, fixtures, haveLatestFixturesStarted }) => (

    <div className="container-card cup-upsets">
        <h2>Cup Upsets</h2>

        <div className="fixtures cup-upsets">
            {fixtures.map((fixture, i) => {
                if (helpers.isACupUpset(teamsForCompetition, fixture)) {
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


CupUpsets.propTypes = {
    teamsForCompetition: PropTypes.array.isRequired,
    fixtures: PropTypes.array.isRequired,
    haveLatestFixturesStarted: PropTypes.bool.isRequired,
}

export default CupUpsets;
