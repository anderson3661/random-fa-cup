import React from "react";

import FixtureRow from "../common/fixture-row";
import * as helpers from '../../utilities/helper-functions/helpers';
import { SEMI_FINALS, FINAL } from "../../utilities/constants";


const RouteToThisStage = ({ fixturesForCompetition, fixtureNumberForCSS, whichTeam, teamName, competitionRound }) => (

    <div className={`container-card route-to-this-stage ${whichTeam} ${fixtureNumberForCSS}`}>
        <h2>{`${teamName}'s route to the ${helpers.getCompetitionRoundLabel(competitionRound)}`}</h2>

        <div className="fixtures route-to-this-stage">
            { helpers.getFixturesPlayedForTeam(fixturesForCompetition, teamName, competitionRound).map((fixture, i) => {
                if (!(competitionRound === SEMI_FINALS && fixture.competitionRound === FINAL)) {            // Don't output if at the semi final stage and attempting to output the final
                    return (
                        <FixtureRow
                            key={i}                                        
                            fixture={fixture}
                            showForLatestFixtures={false}
                            haveLatestFixturesStarted={false}
                            showGoals={true}
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

export default RouteToThisStage;