import React, { Fragment } from "react";
import PropTypes from 'prop-types';

import './fixtures-row-penalties.scss';
import { FOOTBALL_IMAGE, RED_CROSS } from "../../utilities/constants";


const FixtureRowPenalties = ({ penalties, homeTeamsScorePenalties, awayTeamsScorePenalties, fixturesAndResults, isHomeTeamTakingPenaltiesFirst }) => (

    <Fragment>
        <div className="fixtures-row-penalties-summary">
            <div className={`teamScorePenalties homeTeam ${fixturesAndResults ? 'fixtures-and-results' : ''}`}><span>{isHomeTeamTakingPenaltiesFirst ? '(went first)' : ''}</span>{homeTeamsScorePenalties}</div>
            <div className="penaltiesInfo">Penalties</div>
            <div className={`teamScorePenalties awayTeam ${fixturesAndResults ? 'fixtures-and-results' : ''}`}>{awayTeamsScorePenalties}<span>{!isHomeTeamTakingPenaltiesFirst ? '(went first)' : ''}</span></div>
        </div>

        <div className="fixtures-row-penalties-detail">
            {penalties.map((penalty, i) => {
                return (
                    <div key={i} className="fixtures-row-penalties">

                        <div className={`penalty homeTeam ${fixturesAndResults ? 'fixtures-and-results' : ''}`}>
                            <span>{penalty.hasHomeTeamTakenPenalty ? (penalty.hasHomeTeamScored ? <img src={FOOTBALL_IMAGE} alt="" /> : <img src={RED_CROSS} alt="" />) : ''}</span>
                        </div>

                        <div className="penalty number">Penalty { i + 1 }</div>

                        <div className={`penalty awayTeam ${fixturesAndResults ? 'fixtures-and-results' : ''}`}>
                            <span>{penalty.hasAwayTeamTakenPenalty ? (penalty.hasAwayTeamScored ? <img src={FOOTBALL_IMAGE} alt="" /> : <img src={RED_CROSS} alt="" />) : ''}</span>
                        </div>

                    </div>
                )
            })}
        </div>
    </Fragment>
)
    

FixtureRowPenalties.propTypes = {
    penalties: PropTypes.array.isRequired,
    homeTeamsScorePenalties: PropTypes.number.isRequired,
    awayTeamsScorePenalties: PropTypes.number.isRequired,
    fixturesAndResults: PropTypes.bool.isRequired,
    isHomeTeamTakingPenaltiesFirst: PropTypes.bool.isRequired,
}

export default FixtureRowPenalties;
