import React, { Fragment } from "react";

import * as helpers from '../../utilities/helper-functions/helpers';
import FixtureRowPenalties from '../fixtures-latest/fixtures-row-penalties';
import DrawTeamLabels from '../draw/draw-team-labels';
import Top3 from './top3';

import "./fixture-row.scss";

const FixtureRow = (props) => {
    const { homeTeam, awayTeam, homeTeamDivision, awayTeamDivision, homeTeamsScore, awayTeamsScore, homeTeamsGoals, awayTeamsGoals, minutesPlayed, minutesInfo,
            hasFixtureFinished, isExtraTime, isPenalties, penalties, homeTeamsScorePenalties, awayTeamsScorePenalties, isHomeTeamTakingPenaltiesFirst } = props.fixture;
    
    const haveLatestFixturesStarted = (props.haveLatestFixturesStarted === undefined ? false : props.haveLatestFixturesStarted);
    const showForLatestFixtures = (props.showForLatestFixtures === undefined ? false : props.showForLatestFixtures);
    const showForFixturesAndResults = (props.showForFixturesAndResults === undefined ? false : props.showForFixturesAndResults);
    const showRouteToThisStage = (props.showRouteToThisStage === undefined ? false : props.showRouteToThisStage);
    const showGoals = (props.showGoals === undefined ? false : props.showGoals);
    const top3TeamsBeforeFixtures = (props.top3TeamsBeforeFixtures === undefined ? ["", "", ""] : props.top3TeamsBeforeFixtures);
    
    return (

        <Fragment>

            <div className={`fixtures-row ${showRouteToThisStage ? 'route-to-this-stage' : ''} ${showForLatestFixtures ? 'in-play' : ''} ${showForFixturesAndResults ? 'fixtures-and-results' : ''} ${showGoals && hasFixtureFinished ? 'show-goals-hide-border-bottom' : ''} ${isExtraTime && hasFixtureFinished ? 'extra-time-hide-border-bottom' : ''}`}>

                {showRouteToThisStage &&
                    <div className="competitionRound">{ props.competitionRound }</div>
                }

                <div className="homeTeamsName">
                    {showForLatestFixtures &&
                        (top3TeamsBeforeFixtures[0] === homeTeam) ? <Top3 position="1" /> :
                        (top3TeamsBeforeFixtures[1] === homeTeam) ? <Top3 position="2" /> :
                        (top3TeamsBeforeFixtures[2] === homeTeam) ? <Top3 position="3" /> : null                        
                    }
                    <DrawTeamLabels team={{teamName: homeTeam, division: homeTeamDivision}} positionAfter={false} /> 
                </div>

                <div className=
                    // ${((showForLatestFixtures && !haveLatestFixturesStarted) || (!showForLatestFixtures && !hasFixtureFinished)) && !showForFixturesAndResults ? 'timeOnly': ''} 
                    {`timeOrScore 
                        ${showForFixturesAndResults || (showForLatestFixtures && haveLatestFixturesStarted) || (!showForLatestFixtures && hasFixtureFinished) ? 'scoresOnly':''}
                    `}>

                    {/* {(showForFixturesAndResults || (showForLatestFixtures && !haveLatestFixturesStarted) || (!showForLatestFixtures && !hasFixtureFinished)) &&
                        <span className="timeOfFixture">{ showVersus ? 'v' : '15:00' }</span>
                    } */}
                    {((showForLatestFixtures && !haveLatestFixturesStarted) || (!showForLatestFixtures && !hasFixtureFinished)) &&
                        <span className="timeOfFixture">v</span>
                    }

                    {!showForLatestFixtures && hasFixtureFinished && (
                        <Fragment>
                            <span className="finalScore">{ homeTeamsScore }</span>
                            <span className="filler">&nbsp;</span>
                            <span className="finalScore">{ awayTeamsScore }</span>
                        </Fragment>
                    )}

                    {showForLatestFixtures && haveLatestFixturesStarted &&
                        <Fragment>
                            <span className=
                                {`homeTeamsScore 
                                ${haveLatestFixturesStarted && !hasFixtureFinished ? 'activeScore':''} 
                                ${minutesInfo === 'Half-Time' ? 'halfTimeScore':''} 
                                ${hasFixtureFinished ? 'finalScore':''}
                                `}>
                                { homeTeamsScore }
                            </span>

                            <span className="filler">&nbsp;</span>

                            <span className=
                                {`awayTeamsScore 
                                ${haveLatestFixturesStarted && !hasFixtureFinished ? 'activeScore':''} 
                                ${minutesInfo === 'Half-Time' ? 'halfTimeScore':''} 
                                ${hasFixtureFinished ? 'finalScore':''}
                                `}>
                                { awayTeamsScore }
                            </span>
                        </Fragment>
                    }

                </div>

                <div className="awayTeamsName">
                    <DrawTeamLabels team={{teamName: awayTeam, division: awayTeamDivision}} positionAfter={true} /> 
                    {/* <span className={`teamName ${awayTeamDivision}`}>{awayTeam}&nbsp;&nbsp;</span>
                    <span className="divisionAbbreviation">{awayTeamDivisionAbbreviation ? awayTeamDivisionAbbreviation : ""}</span> */}

                    {showForLatestFixtures &&
                        (top3TeamsBeforeFixtures[0] === awayTeam) ? <Top3 position="1" /> :
                        (top3TeamsBeforeFixtures[1] === awayTeam) ? <Top3 position="2" /> :
                        (top3TeamsBeforeFixtures[2] === awayTeam) ? <Top3 position="3" /> : null                        
                    }
                </div>

            </div>

            {((showForFixturesAndResults && showGoals && hasFixtureFinished) || showForLatestFixtures || showRouteToThisStage) &&
                <div className={`fixtures-row-goal-times ${hasFixtureFinished ? 'fixture-finished' : ''} ${isExtraTime ? 'is-extra-time' : ''} ${isPenalties ? 'is-penalties' : ''} ${showForLatestFixtures ? 'in-play' : ''} ${showForFixturesAndResults ? 'fixtures-and-results' : ''} ${showRouteToThisStage ? 'route-to-this-stage' : ''}`}>
                    {showRouteToThisStage && <div className="competitionRound"></div>}
                    <div className="teamsGoalTimes home">&nbsp;{ homeTeamsGoals }</div>
                    <div className="minutesPlayed">{ (showForLatestFixtures && minutesPlayed !== 0) ? minutesInfo : ' '}</div>
                    <div className="teamsGoalTimes away">&nbsp;&nbsp;{ awayTeamsGoals }</div>
                </div>
            }

            {((showForLatestFixtures && hasFixtureFinished) || showForFixturesAndResults || showRouteToThisStage) && (isExtraTime || isPenalties) &&
                <div className={`fixtures-row-penalties-commentary ${isPenalties ? 'is-penalties' : ''} ${showForLatestFixtures ? 'in-play' : ''} ${showForFixturesAndResults ? 'fixtures-and-results' : ''} ${showRouteToThisStage ? 'route-to-this-stage' : ''} ${showGoals ? 'show-goals' : ''}`}>
                    <div className="extraTimeOrPenaltiesSummary">&nbsp;{ helpers.getExtraTimeOrPenaltiesSummary(props.fixture) }</div>
                </div>
            }

            {((showForFixturesAndResults && showGoals) || showForLatestFixtures) && isPenalties && penalties.length > 0 &&
                <FixtureRowPenalties
                    penalties={penalties}
                    homeTeamsScorePenalties={homeTeamsScorePenalties}
                    awayTeamsScorePenalties={awayTeamsScorePenalties}
                    fixturesAndResults={showForFixturesAndResults}
                    isHomeTeamTakingPenaltiesFirst={isHomeTeamTakingPenaltiesFirst}
                />
            }
    
        </Fragment>

    );
}

export default FixtureRow;