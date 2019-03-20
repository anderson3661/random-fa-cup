import React, { Component } from "react";

import DrawTeamLabels from "./draw-team-labels";

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
                    <DrawTeamLabels
                        mainDraw={mainDraw}
                        team={{teamName: homeTeam, division: homeTeamDivision }}
                        latestTeamToBeDrawnNumber={latestTeamToBeDrawnNumber}
                        latestTeamToBeDrawn={latestTeamToBeDrawn}
                        positionAfter={false}
                    />
                </div>

                <div className="versus">v</div>

                <div className="awayTeamsName">
                    <DrawTeamLabels
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

export default DrawTeam;