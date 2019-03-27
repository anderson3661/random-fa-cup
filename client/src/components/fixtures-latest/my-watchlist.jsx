import React from "react";

import FixtureRow from "../common/fixture-row";

import * as helpers from '../../utilities/helper-functions/helpers';


const MyWatchlist = ({ myWatchlistTeams, fixtures, haveLatestFixturesStarted }) => (

    <div className="container-card my-watchlist">
        <h2>My Watchlist</h2>

        <div className="fixtures my-watchlist">
            {fixtures.map((fixture, i) => {
                // Convert fixture (an object) to an array as the areAnyMyWatchlistTeamsPlaying function requires this
                if (helpers.areAnyMyWatchlistTeamsPlaying([fixture], myWatchlistTeams)) {
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

export default MyWatchlist;