import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'

import { MAIN_BACKGROUND_IMAGE, FOOTBALL_IMAGE } from '../../utilities/constants';

import * as helpers from '../../utilities/helper-functions/helpers';

import '../../utilities/css/league-table.scss';

library.add(faArrowUp, faArrowDown);

let LeagueTable = (props) => {

    let leagueTable;
    let { hasSeasonFinished, leagueTableFromStore, tableTypeFull, leagueTableTypeLatestFixtures, leagueTableBeforeLatestFixtures, leagueTableDuringLatestFixtures, showGoalUpdates } = props;

    leagueTable = (leagueTableDuringLatestFixtures === null || leagueTableDuringLatestFixtures === undefined) ? leagueTableFromStore : leagueTableDuringLatestFixtures;
    tableTypeFull = (tableTypeFull === null || tableTypeFull === undefined) ? false : tableTypeFull;
    leagueTableTypeLatestFixtures = (leagueTableTypeLatestFixtures === null || leagueTableTypeLatestFixtures === undefined) ? false : leagueTableTypeLatestFixtures;
    leagueTableBeforeLatestFixtures = (leagueTableBeforeLatestFixtures === null || leagueTableBeforeLatestFixtures === undefined) ? [] : leagueTableBeforeLatestFixtures;    
    showGoalUpdates = (showGoalUpdates === null || showGoalUpdates === undefined) ? false : showGoalUpdates;            // Used for when 'Show Goal Updates' is selected on the Latest Fixtures page

    const mainBodyOfTable =         
        <table className={`league-table${ tableTypeFull ? '-full' : '' }`}>
            <tbody className="league-table-body">

                <tr className="league-table-header">
                    <td className="league-table-position">&nbsp;</td>
                    {leagueTableTypeLatestFixtures && <td className="league-table-movement">&nbsp;</td>}
                    <td className="league-table-teamName">Team</td>
                    <th className="league-table-played">{leagueTableTypeLatestFixtures ? "Pl" : "Played"}</th>
                    <td className="league-table-won">{ tableTypeFull || leagueTableTypeLatestFixtures ? "W" : "Won" }</td>
                    {!showGoalUpdates && <td className="league-table-drawn">{ tableTypeFull || leagueTableTypeLatestFixtures ? "D" : "Drawn" }</td>}
                    {!showGoalUpdates && <td className="league-table-lost">{ tableTypeFull || leagueTableTypeLatestFixtures ? "L" : "Lost" }</td>}
                    {!leagueTableTypeLatestFixtures && <td className="league-table-goalsFor">{ tableTypeFull ? "GF" : "For" }</td>}
                    {!leagueTableTypeLatestFixtures && <td className="league-table-goalsAgainst">{ tableTypeFull ? "GA" : "Against" }</td>}
                    {tableTypeFull && <td className="league-table-won">W</td>}
                    {tableTypeFull && <td className="league-table-drawn">D</td>}
                    {tableTypeFull && <td className="league-table-lost">L</td>}
                    {tableTypeFull && <td className="league-table-goalsFor">GF</td>}
                    {tableTypeFull && <td className="league-table-goalsAgainst">GA</td>}
                    <td className="league-table-goalDifference">GD</td>
                    <td className={`league-table-points ${showGoalUpdates ? "showGoalUpdates" : ""}`}>{leagueTableTypeLatestFixtures ? "Po" : "Points"}</td>
                    {!showGoalUpdates && <td className="league-table-form-header">Form</td>}
                </tr>

                {leagueTable.map((team, i) => {
                    return (
                        <tr key={team.teamName} className="league-table-row">
                            <td className="league-table-position">{i + 1}</td>

                            {leagueTableTypeLatestFixtures &&
                                <td className="league-table-movement">

                                    {leagueTableTypeLatestFixtures && leagueTableBeforeLatestFixtures[0].played > 0 &&
                                        i < helpers.getPositionInArrayOfObjects(leagueTableBeforeLatestFixtures, 'teamName', team.teamName) &&
                                        <FontAwesomeIcon className="arrow-up" icon={faArrowUp} />}

                                    {leagueTableTypeLatestFixtures && leagueTableBeforeLatestFixtures[0].played > 0 &&
                                        i > helpers.getPositionInArrayOfObjects(leagueTableBeforeLatestFixtures, 'teamName', team.teamName) &&
                                        <FontAwesomeIcon className="arrow-down" icon={faArrowDown} />}

                                </td>
                            }

                            <td className="league-table-teamName"><NavLink to={`/teamstats/${ team.teamName }`} className="teamNameLink">{ team.teamName }</NavLink></td>
                            <td className="league-table-played">{ team.played }</td>
                            <td className="league-table-won">{ tableTypeFull ? team.homeWon : team.won }</td>
                            {!showGoalUpdates && <td className="league-table-drawn">{ tableTypeFull ? team.homeDrawn : team.drawn }</td>}
                            {!showGoalUpdates && <td className="league-table-lost">{ tableTypeFull ? team.homeLost : team.lost }</td>}
                            {!leagueTableTypeLatestFixtures && <td className="league-table-goalsFor">{ tableTypeFull ? team.homeGoalsFor : team.goalsFor }</td>}
                            {!leagueTableTypeLatestFixtures && <td className="league-table-goalsAgainst">{ tableTypeFull ? team.homeGoalsAgainst : team.goalsAgainst }</td>}
                            {tableTypeFull && <td className="league-table-won">{ team.awayWon }</td>}
                            {tableTypeFull && <td className="league-table-drawn">{ team.awayDrawn }</td>}
                            {tableTypeFull && <td className="league-table-lost">{ team.awayLost }</td>}
                            {tableTypeFull && <td className="league-table-goalsFor">{ team.awayGoalsFor }</td>}
                            {tableTypeFull && <td className="league-table-goalsAgainst">{ team.awayGoalsAgainst }</td>}
                            <td className="league-table-goalDifference">{ team.goalDifference }</td>
                            <td className={`league-table-points ${showGoalUpdates ? "showGoalUpdates" : ""}`}>{ team.points }</td>
                            {!showGoalUpdates &&
                                <td className="league-table-form">
                                    {team.form.map((formElement, i) => {
                                        return <span key={i} className={"league-table-form-cell " + formElement}>{ formElement }</span>
                                    })}
                                </td>
                            }
                        </tr>
                    )
                })}
            </tbody>
        </table>

    if(leagueTableTypeLatestFixtures) {
        return (
            <div className="league-table-in-play">
                <h3>As It Stands Table</h3>
                {mainBodyOfTable}
            </div>
        )
    } else {
        return (
            <div className="container-main-content-league-table">
                <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>
                <div className="container-card tables">
                    <div className="main-header">
                        <img src={FOOTBALL_IMAGE} alt="" />
                        <h1>Premier League Table { hasSeasonFinished ? " - Final" : "" }</h1>
                        <img src={FOOTBALL_IMAGE} alt="" />
                    </div>
                    {mainBodyOfTable}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        leagueTableFromStore: state.default.leagueTable,
        hasSeasonFinished: state.default.miscellaneous.hasSeasonFinished,
    }
}

LeagueTable = connect(mapStateToProps, null)(LeagueTable)

export default LeagueTable;