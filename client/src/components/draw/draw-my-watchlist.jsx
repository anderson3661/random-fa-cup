import React, { Component } from "react";
import PropTypes from 'prop-types';

import DrawTeam from "./draw-team";


class DrawMyWatchlist extends Component {

    shouldComponentUpdate(nextProps) {
        // Only update the component if one of the teams is one of my watchlist teams
        return (nextProps.doesLatestFixtureToBeDrawnContainAMyWatchlistTeam === undefined ? true : nextProps.doesLatestFixtureToBeDrawnContainAMyWatchlistTeam);
    }

    render() {

        const { myWatchlist } = this.props;

        return (

            <div className="container-card my-watchlist" id="myWatchlistTeams">

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


DrawMyWatchlist.propTypes = {
    myWatchlist: PropTypes.array.isRequired,
}

export default DrawMyWatchlist;
