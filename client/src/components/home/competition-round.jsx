import React from "react";
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as helpers from '../../utilities/helper-functions/helpers';


const CompetitionRound = ({ linkTo, competitionRoundOfLink, isCompetitionRoundActive, displayDrawLabel, displayPlayReplaysLabel,
                            displayPlayFixturesLabel, displayResultsLabel, displayFixturesLabel, displayFixturesAndResultsLabel }) => (

    <NavLink to={linkTo} className="nav-link" activeClassName="active-link">

        <div className={`competition-round ${"_" + competitionRoundOfLink} ${isCompetitionRoundActive ? "active" : "deactivated"}`}>

            <div className="competition-round-label">{helpers.getCompetitionRoundLabel(competitionRoundOfLink, false)}</div>

            {displayDrawLabel && <div>Draw</div>}

            {(displayPlayReplaysLabel || displayPlayFixturesLabel) && <div className="play">Play {displayPlayReplaysLabel ? "Replays" : (displayPlayFixturesLabel ? helpers.getFixturesLabel(competitionRoundOfLink) : "")}</div>}

            {(displayResultsLabel || displayFixturesLabel || displayFixturesAndResultsLabel) &&
                 <div className="fixtures-and-results">
                    {displayResultsLabel ? helpers.getResultsLabel(competitionRoundOfLink) : (displayFixturesAndResultsLabel ? "Fixtures / Results" : (displayFixturesLabel ? helpers.getFixturesLabel(competitionRoundOfLink) : "")) }
                </div>
            }

        </div>

    </NavLink>

)


CompetitionRound.propTypes = {
    linkTo: PropTypes.string.isRequired,
    competitionRoundOfLink: PropTypes.string.isRequired,
    isCompetitionRoundActive: PropTypes.bool.isRequired,
    displayDrawLabel: PropTypes.bool.isRequired,
    displayPlayReplaysLabel: PropTypes.bool.isRequired,
    displayPlayFixturesLabel: PropTypes.bool.isRequired,
    displayResultsLabel: PropTypes.bool.isRequired,
    displayFixturesLabel: PropTypes.bool.isRequired,
    displayFixturesAndResultsLabel: PropTypes.bool.isRequired,
}

export default CompetitionRound;
