import React from "react";
import { NavLink } from 'react-router-dom';

import * as helpers from '../../utilities/helper-functions/helpers';


const CompetitionRound = ({ linkTo, competitionRoundOfFootball, isCompetitionRoundActive, displayDrawLabel, displayPlayReplaysLabel,
                            displayPlayFixturesLabel, displayResultsLabel, displayFixturesLabel, displayFixturesAndResultsLabel }) => (

    <NavLink to={linkTo} className="nav-link" activeClassName="active-link">

        <div className={`competition-round ${"_" + competitionRoundOfFootball} ${isCompetitionRoundActive ? "active" : "deactivated"}`}>

            <div className="competition-round-label">{helpers.getCompetitionRoundLabel(competitionRoundOfFootball, false)}</div>

            {displayDrawLabel && <div>Draw</div>}

            {(displayPlayReplaysLabel || displayPlayFixturesLabel) && <div className="play">Play {displayPlayReplaysLabel ? "Replays" : (displayPlayFixturesLabel ? helpers.getFixturesLabel(competitionRoundOfFootball) : "")}</div>}

            {(displayResultsLabel || displayFixturesLabel || displayFixturesAndResultsLabel) &&
                 <div className="fixtures-and-results">
                    {displayResultsLabel ? helpers.getResultsLabel(competitionRoundOfFootball) : (displayFixturesAndResultsLabel ? "Fixtures / Results" : (displayFixturesLabel ? helpers.getFixturesLabel(competitionRoundOfFootball) : "")) }
                </div>
            }

        </div>

    </NavLink>

)

export default CompetitionRound;