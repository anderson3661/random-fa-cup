import React, { Component } from "react";
import PropTypes from 'prop-types';

import DrawTeam from "./draw-team";


class DrawPremierLeagueTeams extends Component {

    shouldComponentUpdate(nextProps) {
        // Only update the component if the division of the team (or teams in case of unplayed replay) is in the premier league
        return (nextProps.doesLatestFixtureToBeDrawnContainAPremierLeagueTeam === undefined ? true : nextProps.doesLatestFixtureToBeDrawnContainAPremierLeagueTeam);
    }

    render() {

        const { premierLeagueTeams } = this.props;

        return (

            <div className="container-card premier-league-teams"  id="premierLeagueTeams">

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


DrawPremierLeagueTeams.propTypes = {
    premierLeagueTeams: PropTypes.array.isRequired,
}

export default DrawPremierLeagueTeams;
