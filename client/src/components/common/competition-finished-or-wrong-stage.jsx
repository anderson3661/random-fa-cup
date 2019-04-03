import React from "react";

import { FOOTBALL_IMAGE } from '../../utilities/constants';


const CompetitionFinishedOrWrongStage = ({ authenticated, hasCompetitionFinished, displayHeader, displayType, isHomeNav, isSettingsNav }) => (

    <div className={`container-card ${hasCompetitionFinished ? 'competition-finished' : 'not-at-this-stage'} ${isHomeNav ? 'home-nav' : ''} ${isSettingsNav ? 'settings-nav' : ''}`}>

        <div className="main-header">
            <div className="image-left"><img src={FOOTBALL_IMAGE} alt="" /></div>
            <h1>{ displayHeader }</h1>
            <div className="image-right"><img src={FOOTBALL_IMAGE} alt="" /></div>
        </div>

        <p>{!authenticated ? "Please log in to use the application" :
            (hasCompetitionFinished ? 'In order to play again, please reset the app via Settings' :
            `The ${displayType} for this round cannot take place at this stage of the competition`)}
        </p>

    </div>

)

export default CompetitionFinishedOrWrongStage;