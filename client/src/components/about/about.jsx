import React from "react";

import { MAIN_BACKGROUND_IMAGE, FOOTBALL_IMAGE, HOSTING_SITE } from '../../utilities/constants';

import "./about.scss";

const About = () => {

    return (

        <div className="outer-container-about">
            <div className="container-main-content-about">
                <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>

                <div className="container-card about">

                    <header>
                        <img src={FOOTBALL_IMAGE} alt="" />
                        <h1>Random FA Cup App</h1>
                        <img src={FOOTBALL_IMAGE} alt="" />
                    </header>

                    <p>This app allows you to play all the rounds of a football cup competition, like the FA or League Cup.</p>
                    <p>The way it works is that for each minute of each tie a random number is generated and if that number is within a certain tolerance then a goal is scored.</p>
                    <p>You start by entering teams and various factors on the <span>Settings</span> page.</p>
                    <p>Once teams and factors have been entered (or the defaults used) then click on the <span>1st Round Draw</span> to create the ties for the 1st round.</p>
                    <p>Then click on the link to play the <span>1st Round fixtures</span>.</p>
                    <p>Once each round has been completed the <span>Fixtures and Results</span> page will be updated, and the draw for the succeeding round will become available.</p>
                    <p>For each round of the competition (excluding the semi-finals and final), if the scores are level after 90 minutes, then a fixture will go to a replay.</p>
                    <p>For replays and the semi-finals and final, if the scores are level after 90 minutes, then extra time and, if necessary, penalties will be played.</p>
                    <p>&nbsp;</p>
                    <p>You can specify:</p>
                    <ul>
                        <li>which <span>teams</span> from each league make up the competition</li>
                        <li><span>My Watchlist Teams</span>, i.e. teams to more easily monitor during the competition</li>
                        <li>the <span>top teams</span>, and whether they have a slight advantage</li>
                        <li>whether the <span>home teams</span> have a slight advantage</li>
                        <li>the <span>periods</span> during a match which are more likely to produce goals</li>
                        <li>the advantage that teams from a <span>higher division</span> have over teams from lower divisions</li>
                        <li>whether you want high-scoring or low-scoring matches</li>
                        <li>the <span>speed</span> at which the fixtures are updated</li>
                    </ul>
                </div>

                <div className="container-technical">

                    <div className="container-card">
                        <h2>Technologies Used</h2>
                        <ul>
                            <li>Node.js, Mongo Db, Express, Mongoose for persisting data</li>
                            <li>React</li>
                            <li>React Router</li>
                            <li>Redux (including combined reducers)</li>
                            <li>SCSS (CSS preprocessor)</li>
                            <li>HTML5</li>
                            <li>CSS3 Flexbox and Grid</li>
                        </ul>
                    </div>

                    <div className="container-inner">

                        <div className="container-card">
                            <h2>Hosting</h2>
                            <p>It is hosted on Heroku:</p>
                            <ul>
                                <li>
                                    <a
                                        href={HOSTING_SITE}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Hosting Site
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="container-card">
                            <h2>Authentication</h2>
                            <p>
                                Users need to <span>Sign Up</span> and <span>Log In</span> in order to use features within the system
                            </p>
                        </div>

                        {/* <div className="container-card">
                            <h2>Administrator Access</h2>
                            <p>Users with the administration role (set in Firebase) can:</p>
                            <ul>
                                <li>
                                Use Firebase to persist the application data (i.e. instead of
                                using the browser's local storage)
                                </li>
                            </ul>
                        </div> */}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;