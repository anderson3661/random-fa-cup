import React from "react";
import { NavLink } from 'react-router-dom';

import * as helpers from '../../utilities/helper-functions/helpers';


const CompetitionRound = ({ linkTo, competitionRoundOfFootball, isCompetitionRoundActive,
                            displayDrawLabel, displayPlayReplaysLabel, displayPlayFixturesLabel, displayResultsLabel, displayFixturesLabel, displayFixturesAndResultsLabel }) => (

    <NavLink to={linkTo} className="nav-link" activeClassName="active-link">

        <div className={`competition-round ${"_" + competitionRoundOfFootball} ${isCompetitionRoundActive ? "active" : "deactivated"}`}>

            <div className="competition-round-label">{helpers.getCompetitionRoundLabel(competitionRoundOfFootball, false)}</div>

            {displayDrawLabel && <div>Draw</div>}

            {(displayPlayReplaysLabel || displayPlayFixturesLabel) && <div>Play {displayPlayReplaysLabel ? "Replays" : (displayPlayFixturesLabel ? "Fixtures" : "")}</div>}

            {(displayResultsLabel || displayFixturesLabel || displayFixturesAndResultsLabel) &&
                 <div className="fixtures-and-results">
                    {displayResultsLabel ? "Results" : (displayFixturesAndResultsLabel ? "Fixtures / Results" : (displayFixturesLabel ? "Fixtures" : "")) }
                </div>
            }

        </div>

    </NavLink>

)

export default CompetitionRound;