import React, { Component } from "react";
import PropTypes from 'prop-types';

import TeamLabels from "../common/team-labels";

import "./draw-team.scss";


class DrawTeam extends Component {

    shouldComponentUpdate(nextProps) {
        // When each team is drawn all of the fixtures will be re-rendered.
        // A lot of these fixtures will be blank (until the draw reaches that fixture), so just test to see if both teams are undefined
        // Could try and make this even cleverer (i.e. just test for the fixture being drawn, but no need as quick enough)
        return (nextProps.fixture.homeTeam !== undefined || nextProps.fixture.awayTeam !== undefined);
    }

    render() {

        const { homeTeam, awayTeam, homeTeamDivision, awayTeamDivision } = this.props.fixture;
        const { mainDraw, latestTeamToBeDrawnNumber, latestTeamToBeDrawn } = this.props;
        
        return (

            <div className="draw-row">

                <div className="homeTeamsName">
                    <TeamLabels
                        mainDraw={mainDraw}
                        team={{teamName: homeTeam, division: homeTeamDivision }}
                        latestTeamToBeDrawnNumber={latestTeamToBeDrawnNumber}
                        latestTeamToBeDrawn={latestTeamToBeDrawn}
                        positionAfter={false}
                    />
                </div>

                <div className="versus">v</div>

                <div className="awayTeamsName">
                    <TeamLabels
                        mainDraw={mainDraw}
                        team={{teamName: awayTeam, division: awayTeamDivision }}
                        latestTeamToBeDrawnNumber={latestTeamToBeDrawnNumber}
                        latestTeamToBeDrawn={latestTeamToBeDrawn}
                        positionAfter={true}
                    />
                </div>

            </div>

        );
    }
}


DrawTeam.defaultProps = {
    mainDraw: false,
}

DrawTeam.propTypes = {
    fixture: PropTypes.object.isRequired,
    mainDraw: PropTypes.bool.isRequired,
    latestTeamToBeDrawnNumber: PropTypes.number,                // Not required as will be blank before the draw is made
    latestTeamToBeDrawn: PropTypes.string,                      // Not required as will be blank before the draw is made
}

export default DrawTeam;
