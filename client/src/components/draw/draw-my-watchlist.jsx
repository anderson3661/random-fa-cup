import React, { Component } from "react";

import DrawTeam from "./draw-team";

import * as helpers from '../../utilities/helper-functions/helpers';


class DrawMyWatchlist extends Component {

    shouldComponentUpdate(nextProps) {
        // Only update the component if one of the teams is one of my watchlist teams
        // The latest fixture added by the draw is tested so that there aren't unnecessary renders
        if (nextProps.latestFixtureToBeDrawn && (
            (nextProps.latestFixtureToBeDrawn.homeTeam && helpers.isOneOfMyWatchlistTeams(nextProps.latestFixtureToBeDrawn.homeTeam, nextProps.myWatchlistTeams)) ||
            (nextProps.latestFixtureToBeDrawn.awayTeam && helpers.isOneOfMyWatchlistTeams(nextProps.latestFixtureToBeDrawn.awayTeam, nextProps.myWatchlistTeams)))) {
                return true;
            }
        return false;
    }

    render() {

        const { myWatchlist } = this.props;

        return (

            <div className="container-card my-watchlist">

                <div className="main-header">
                    <h2>My Watchlist</h2>
                </div>

                {myWatchlist.map((fixture, i) => {
                    return (
                        <DrawTeam key={i} fixture={fixture} />
                    );
                })}

            </div>
        );
    }
}

export default DrawMyWatchlist;