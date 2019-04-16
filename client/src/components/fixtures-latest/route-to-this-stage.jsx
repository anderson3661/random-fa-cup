import React from "react";
import PropTypes from 'prop-types';

import FixtureRow from "../common/fixture-row";
import * as helpers from '../../utilities/helper-functions/helpers';
import { SEMI_FINALS, FINAL } from "../../utilities/constants";


const RouteToThisStage = ({ fixturesForCompetition, fixtureNumberForCSS, whichTeam, teamName, competitionRound, showGoals, displayHeader }) => (

    <div className={`container-card route-to-this-stage ${whichTeam} ${fixtureNumberForCSS}`}>
        
        {displayHeader && <h2>{`${teamName}'s route to the ${helpers.getCompetitionRoundLabel(competitionRound)}`}</h2>}

        <div className="fixtures route-to-this-stage">
            { helpers.getFixturesPlayedForTeam(fixturesForCompetition, teamName, competitionRound).map((fixture, i) => {
                if (!(competitionRound === SEMI_FINALS && fixture.competitionRound === FINAL)) {            // Don't output if at the semi final stage and attempting to output the final
                    return (
                        <FixtureRow
                            key={i}                                        
                            fixture={fixture}
                            showForLatestFixtures={false}
                            haveLatestFixturesStarted={false}
                            showGoals={showGoals}
                            showVersus={false}
                            showRouteToThisStage={true}
                            competitionRound={helpers.getCompetitionRoundLabel(fixture.competitionRound, true)}
                        />
                    )
                }
                return null;
            })}
        </div>
    </div>
)


RouteToThisStage.defaultProps = {
    displayHeader: true,
    showGoals: true,
}

RouteToThisStage.propTypes = {
    fixturesForCompetition: PropTypes.array.isRequired,
    fixtureNumberForCSS: PropTypes.string.isRequired,
    whichTeam: PropTypes.string.isRequired,
    teamName: PropTypes.string.isRequired,
    competitionRound: PropTypes.string.isRequired,
    showGoals: PropTypes.bool.isRequired,
    displayHeader: PropTypes.bool.isRequired,
}

export default RouteToThisStage;
