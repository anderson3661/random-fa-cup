import React, { Fragment } from "react";
import PropTypes from 'prop-types';

import * as helpers from '../../utilities/helper-functions/helpers';

const TeamLabels = (props) => {
    let slash;
    let slashIndex;
    let teamsSlashIndex;
    let teamFirst;
    let teamLast;
    let divisionFirst;
    let divisionLast;
    let divisionAbbreviation;
    
    const { mainDraw, latestTeamToBeDrawn, latestTeamToBeDrawnNumber, positionAfter } = props;
    const { division, teamName } = props.team;

    if (teamName) {
        slash = "/";
        slashIndex = division.indexOf('/');
        teamsSlashIndex = teamName.indexOf('/');
        teamFirst = teamName.substr(0, teamsSlashIndex - 1);
        teamLast = teamName.substr(teamsSlashIndex + 2);
        divisionFirst = division.substr(0, slashIndex - 1);
        divisionLast = division.substr(slashIndex + 2);
        divisionAbbreviation = helpers.getDivisionAbbreviationForFixtureOrDrawRow(division);
    }

    return (

        <Fragment>
            {slashIndex !== -1 ?
                <Fragment>
                    {positionAfter ?
                        <Fragment>
                            <span className={divisionFirst}>{teamFirst}</span>&nbsp;
                            <span className="division">{helpers.getDivisionAbbreviationForFixtureOrDrawRow(divisionFirst)}</span>
                            &nbsp;{slash}&nbsp;
                            <span className={divisionLast}>{teamLast}</span>&nbsp;
                            <span className="division">{helpers.getDivisionAbbreviationForFixtureOrDrawRow(divisionLast)}</span>
                        </Fragment>
                    :
                        <Fragment>
                            <span className="division">{helpers.getDivisionAbbreviationForFixtureOrDrawRow(divisionFirst)}</span>&nbsp;
                            <span className={divisionFirst}>{teamFirst}</span>
                            &nbsp;{slash}&nbsp;
                            <span className="division">{helpers.getDivisionAbbreviationForFixtureOrDrawRow(divisionLast)}</span>&nbsp;
                            <span className={divisionLast}>{teamLast}</span>
                        </Fragment>
                    }
                </Fragment>
            :
                <Fragment>
                    {positionAfter ?
                        <Fragment>
                            {mainDraw && teamName !== undefined && latestTeamToBeDrawn === teamName &&
                                <div className="teamNumberBlank">
                                    <span className="teamNumberInDraw">{latestTeamToBeDrawnNumber ? latestTeamToBeDrawnNumber : ''}</span>
                                </div>
                            }
                            <span className={division}>{teamName}</span>&nbsp;<span className="division">{divisionAbbreviation}</span>
                        </Fragment>
                    :
                        <Fragment>
                            {mainDraw && teamName !== undefined && latestTeamToBeDrawn === teamName &&
                                <div className="teamNumberBlank">
                                    <span className="teamNumberInDraw">{latestTeamToBeDrawnNumber ? latestTeamToBeDrawnNumber : ''}</span>
                                </div>
                            }
                            <span className="division">{divisionAbbreviation}</span>&nbsp;<span className={division}>{teamName}</span>
                        </Fragment>
                    }
                </Fragment>
            }
        </Fragment>
    );
}


TeamLabels.defaultProps = {
    mainDraw: false,
}

TeamLabels.propTypes = {
    mainDraw: PropTypes.bool.isRequired,
    latestTeamToBeDrawn: PropTypes.string,                      // Not required as will be blank before the draw is made
    latestTeamToBeDrawnNumber: PropTypes.number,                // Not required as will be blank before the draw is made
    positionAfter: PropTypes.bool.isRequired,
    team: PropTypes.object.isRequired,
}

export default TeamLabels;
