import React from 'react';
import ReactHtmlParser from 'react-html-parser';

import { MAIN_BACKGROUND_IMAGE, FOOTBALL_IMAGE } from '../../utilities/constants';

import './help.scss';

const dataHelp = [
    {
        heading: 'What does this app do',
        details: [
            "This app allows you to play through each round of a football cup competition (e.g. FA Cup).",
            "The way it works is that for each minute of each fixture a random number is generated and if that number is within a certain tolerance then a goal is scored.",
            "You start by entering teams and various factors on the <span>Settings</span> page.  Once these have been entered (or system defaults used) then click on the <span>1st Round Draw</span> link to start the competition.",
        ]
    },
    {
        heading: 'What is Settings - Reset App',
        details: [
            "Click on <span>Settings</span> in the main menu, then click on <span>Reset App</span>.",
            "When you use the application by saving values on the <span>Settings</span> page, making the draws for each round, or running fixtures on the <span>Latest Fixtures</span> page, all these changes are saved to a database.",
            "You are given the option to either a) reset the app and keep the current settings (most likely preference), or b) reset the app and revert the settings back to the application default values.",
        ]
    },
    {
        heading: 'What is Settings - My Watchlist Teams',
        details: [
            "Click on <span>Settings</span> in the main menu, then scroll down to the bottom of the page.",
            "<span>My Watchlist Teams</span> allows you to select one of more teams to monitor during the competition.",
            "Whilst these teams remain in the competition they will be visible on the <span>Draw</span> and <span>Fixtures</span> pages, allowing you to easily monitor their progress.",
        ]
    },
    {
        heading: 'What is Settings - Season',
        details: [
            "<span>Season</span> just specifies the season for the competition in YYYY/YY format.",
        ]
    },
    {
        heading: 'What is Settings - Fixture Update Interval (seconds)',
        details: [
            "This sets the rate at which each fixture updates on the <span>Draw</span> and <span>Latest Fixtures</span> pages.",
            "On the basis that a fixture lasts 90 minutes, then for each notional minute a check is done to see if a goal has been scored by either team.",
            "Rather then wait 90 minutes for the app to update, you can set <span>Fixture Update Interval (seconds)</span>.",
            "So, for example, a setting of 1 means it will take 90 seconds to complete a fixture, a setting of 0.5 means it will take 45 seconds.",
        ]
    },
    {
        heading: 'What is Settings - Base For Random Multiplier',
        details: [
            "The way the app works is that for a fixture lasting say 90 minutes, for each notional minute a check is done to see if a goal has been scored by either team.",
            "This check involves creating a random number and comparing it to a factor (i.e. <span>Is It A Goal Factor</span>).",
            "The random number is calculated using a base value (i.e. <span>Base For Random Multiplier</span>) and several other factors on the <span>Settings</span> page.",
            "Therefore the random number could be between 1 and 90 for a top team playing at home, or between 1 and 140 for a 'not top' team playing away (i.e. 90 x 1.25 x 1.25).",
        ]
    },
    {
        heading: 'What is Settings - Away Team Factor',
        details: [
            "This factor recognises that more games are won by the home team.",
            "Therefore, a factor of 1.25 for example means that the base factor (i.e. <span>Base For Random Multiplier</span>) is multiplied by this factor.",
            "Therefore a random number for home teams is generated from 0 to 90 and for away teams is 0 to 112 (i.e. 90 * 1.25).",
            "Note that 90 or 112 above is a simplification as other factors are taken into account as well.",
            "This setting does not apply in the semi-finals or final as these fixtures are played at a neutral ground.",
        ]
    },
    {
        heading: 'What is Settings - Is Not A Top Team Factor',
        details: [
            "This factor recognises that there are a few teams who are better than others and therefore more likely to win.",
            "Therefore, a factor of 1.25 for example means that the base factor (i.e. <span>Base For Random Multiplier</span>') is multiplied by this factor.",
            "Therefore a random number for top teams is generated from 0 to 90 and for other teams is 0 to 112 (i.e. 90 * 1.25).",
            "Note that 90 or 112 above is a simplification as other factors are taken into account as well.",
        ]
    },
    {
        heading: 'What is Settings - Division Factor',
        details: [
            "This factor recognises that teams from a higher division are more likely to beat teams from a lower division.",
            "Therefore, a factor of 1.25 for example means that the base factor (i.e. <span>Base For Random Multiplier</span>') is multiplied by this factor, for each difference in division.",
            "Therefore the random numbers for a match between a Premier League team and a Non-League team is 0 to 90 for the Premier League team and 0 to 219 (i.e. 90 * 1.25 * 1.25 * 1.25 * 1.25) for the Non-League team.",
            "Note that 90 or 219 above is a simplification as other factors are taken into account as well.",
        ]
    },
    {
        heading: 'What is Settings - Is It A Goal Factor',
        details: [
            "For each minute of each fixture a random number is generated for both the home and away team.",
            "This random number is generated based on a number of factors, i.e. base value multiplied by away team factor (if applicable), multiplied by not top team factor (if applicable), multiplied by difference in division (if applicable), multiplied by goals per minute factor.",
            "if the value of the random number generated is less than or equal to the <span>Is It A Goal Factor</span> then a goal is scored.",
        ]
    },
    {
        heading: 'What is Settings - Is It A Goal Factor (Penalty)',
        details: [
            "For each round of the competition (excluding the semi-finals and final), if the scores are level after 90 minutes, then the fixture will go to a replay.",
            "For replays and the semi-finals and final, if the scores are level after 90 minutes, then extra time and, if necessary, penalties will be played.",
            "If a fixture goes to penalties, for each penalty a random number is generated for both the home and away team.",
            "if the value of the random number generated is less than or equal to the <span>Is It A Goal Factor (Penalty)</span> then the penalty is scored.",
        ]
    },
    {
        heading: 'What is Settings - Goals per Minute Factor',
        details: [
            "This factor recognises that there periods of matches when a goal is more likely to be scored (e.g. it is more likely that a goal will be scored in the last 10 minutes than the first 10 minutes).",
            "The field is a series of objects within an array.  The format of each object is {'minutes': XX, 'factor': X.X}.",
            "Don't set the factor to more than 2 as the chances of a goal being scored will reduce significantly.",
            "Set the 'minutes' property of the final object to over 130 to allow for extra time and injury time to be played.",
        ]
    },
    {
        heading: 'Injury (or Additional) Time',
        details: [
            "At the end of each period of play, injury (or additional) time is played.",
            "The amount of injury time for each fixture is based on a random number.",
            "The maximum amount of injury time for each period of play is: after 45 mins: 5 additional minutes, after 90 mins: 9 additional minutes, after 105 mins (Extra Time): 2 additional minutes, after 120 mins (Extra Time): 3 additional minutes.",
        ]
    }

]

const Help = () => {

    return (

        <div className="outer-container-help">
            <div className="container-main-content-help">
                <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>

                <div className="container-card">

                    <header>
                        <img src={FOOTBALL_IMAGE} alt="" />
                        <h1>Help</h1>
                        <img src={FOOTBALL_IMAGE} alt="" />
                    </header>

                    {dataHelp.map((data, i) => {
                        return (
                            <div key={i} className="accordion">
                                <div className="accordion__item">
                                    <a href={`#tab${i+1}`} className="accordion__trigger accordion__title">{data.heading}</a>
                                    <div id={`tab${i+1}`} className="accordion__content">
                                        {data.details.map((para, j) => <p key={j}>{ReactHtmlParser(para)}</p>)}
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>
    );
}
 
export default Help;