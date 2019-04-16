import React from "react";
import PropTypes from 'prop-types';

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


DrawFixtures.propTypes = {
    fixturesMadeByDraw: PropTypes.array.isRequired,
    latestTeamToBeDrawnNumber: PropTypes.number,                // Not required as will be blank before the draw is made
    latestTeamToBeDrawn: PropTypes.string,                      // Not required as will be blank before the draw is made
}

export default DrawFixtures;
