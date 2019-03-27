import React from "react";

import DrawTeam from "./draw-team";


const DrawFixtures = ({fixturesMadeByDraw, latestTeamToBeDrawnNumber, latestTeamToBeDrawn}) => (

    fixturesMadeByDraw.map((fixture, i) => {
        return (
            <DrawTeam
                key={i}
                mainDraw={true}
                fixture={fixture}
                latestTeamToBeDrawnNumber={latestTeamToBeDrawnNumber}
                latestTeamToBeDrawn={latestTeamToBeDrawn}
            />
        );
    })

)

export default DrawFixtures;