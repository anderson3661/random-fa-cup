import React from "react";
import PropTypes from 'prop-types';

// import Typing from 'react-typing-animation';
import './goal-updates.scss';


const GoalUpdates = ({ fixtureUpdates }) => (

    <div className="container-card in-play-updates">

        <div className="fixtures in-play-updates" id="in-play-updates">

            <h3>Goal Updates</h3>

            {fixtureUpdates.map((update, i) => {
                return (
                <div key={i} className="goal-update">
                    {/* <Typing> */}
                        <div className="minsBlank">
                            <span className="mins">{update.mins}</span>
                        </div>
                        <span className={`team ${update.scoringTeam === "Home" ? "goal" : ""} home`}>{update.homeTeam} {update.homeTeamsScore}</span>
                        <span className={`team ${update.scoringTeam === "Away" ? "goal" : ""} away`}>{update.awayTeam} {update.awayTeamsScore}</span>
                    {/* </Typing> */}
                </div>
                )
            })}

        </div>

    </div>

)


GoalUpdates.propTypes = {
    fixtureUpdates: PropTypes.array.isRequired,
}

export default GoalUpdates;
