import React, { Component } from "react";

import DrawTeam from "./draw-team";

import * as helpers from '../../utilities/helper-functions/helpers';


class DrawPremierLeagueTeams extends Component {

    shouldComponentUpdate(nextProps) {
        // Only update the component if the division of the team (or teams in case of unplayed replay) is the premier league
        // The latest fixture added by the draw is tested so that there aren't unnecessary renders
        if (nextProps.latestFixtureToBeDrawn && (
            (nextProps.latestFixtureToBeDrawn.homeTeamDivision && helpers.containsPremierLeague(nextProps.latestFixtureToBeDrawn.homeTeamDivision)) ||
            (nextProps.latestFixtureToBeDrawn.awayTeamDivision && helpers.containsPremierLeague(nextProps.latestFixtureToBeDrawn.awayTeamDivision)))) {
                return true;
            }
        return false;
    }

    render() {

        const { premierLeagueTeams } = this.props;

        return (

            <div className="container-card premier-league-teams">

                <div className="main-header">
                    <h2>Premier League Teams</h2>
                </div>

                {premierLeagueTeams.map((fixture, i) => {
                    return (
                        <DrawTeam key={i} fixture={fixture} />
                    );
                })}

            </div>
        );
    }
}

export default DrawPremierLeagueTeams;