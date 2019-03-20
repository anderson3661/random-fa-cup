import React, { Fragment } from "react";

import { DIVISIONS, DIVISIONS_ABBREVIATIONS } from '../../utilities/constants';

const DrawTeamLabels = (props) => {
    let slash;
    let slashIndex;
    let teamsSlashIndex;
    let teamFirst;
    let teamLast;
    let divisionFirst;
    let divisionLast;
    let divisionAbbreviation;
    
    const { mainDraw, latestTeamToBeDrawnNumber, positionAfter } = props;
    const { division, teamName } = props.team;
    const latestTeamToBeDrawn = props.latestTeamToBeDrawn;

    if (teamName) {
        slash = "/";
        slashIndex = division.indexOf('/');
        teamsSlashIndex = teamName.indexOf('/');
        teamFirst = teamName.substr(0, teamsSlashIndex - 1);
        teamLast = teamName.substr(teamsSlashIndex + 2);
        divisionFirst = division.substr(0, slashIndex - 1);
        divisionLast = division.substr(slashIndex + 2);
        divisionAbbreviation = (division === 'premierLeague' ? null : DIVISIONS_ABBREVIATIONS[DIVISIONS.indexOf(division)]);
    }

    return (

        <Fragment>
            {slashIndex !== -1 ?
                <Fragment>
                    {positionAfter ?
                        <Fragment>
                            <span className={divisionFirst}>{teamFirst}</span>&nbsp;
                            <span className="division">{divisionFirst === 'premierLeague' ? null : DIVISIONS_ABBREVIATIONS[DIVISIONS.indexOf(divisionFirst)]}</span>
                            &nbsp;{slash}&nbsp;
                            <span className={divisionLast}>{teamLast}</span>&nbsp;
                            <span className="division">{divisionLast === 'premierLeague' ? null : DIVISIONS_ABBREVIATIONS[DIVISIONS.indexOf(divisionLast)]}</span>
                        </Fragment>
                    :
                        <Fragment>
                            <span className="division">{divisionFirst === 'premierLeague' ? null : DIVISIONS_ABBREVIATIONS[DIVISIONS.indexOf(divisionFirst)]}</span>&nbsp;
                            <span className={divisionFirst}>{teamFirst}</span>
                            &nbsp;{slash}&nbsp;
                            <span className="division">{divisionLast === 'premierLeague' ? null : DIVISIONS_ABBREVIATIONS[DIVISIONS.indexOf(divisionLast)]}</span>&nbsp;
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
                                    <span className="teamNumberInDraw">{latestTeamToBeDrawnNumber ? latestTeamToBeDrawnNumber + 1 : ''}</span>
                                </div>
                            }
                            <span className={division}>{teamName}</span>&nbsp;<span className="division">{divisionAbbreviation}</span>
                        </Fragment>
                    :
                        <Fragment>
                            {mainDraw && teamName !== undefined && latestTeamToBeDrawn === teamName &&
                                <div className="teamNumberBlank">
                                    <span className="teamNumberInDraw">{latestTeamToBeDrawnNumber ? latestTeamToBeDrawnNumber + 1 : ''}</span>
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

export default DrawTeamLabels;