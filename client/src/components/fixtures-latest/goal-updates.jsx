import React from "react";

// import Typing from 'react-typing-animation';


const GoalUpdates = ({ fixtureUpdates }) => (

    <div className="container-card in-play-updates">

        <div className="fixtures in-play-updates" id="in-play-updates">

            <h3>Goal Updates</h3>

            {fixtureUpdates.map((update, i) => {
                return (
                <p key={i}>
                    {/* <Typing> */}
                        <span className="mins">{update.mins}</span>
                        <span className={`team ${update.scoringTeam === "Home" ? "goal" : ""}`}>{update.homeTeam} {update.homeTeamsScore}</span>
                        &nbsp;&nbsp;
                        <span className={`team ${update.scoringTeam === "Away" ? "goal" : ""}`}>{update.awayTeam} {update.awayTeamsScore}</span>
                    {/* </Typing> */}
                </p>
                )
            })}

        </div>

    </div>

)

export default GoalUpdates;