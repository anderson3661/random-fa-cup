import React from 'react';
import ReactHtmlParser from 'react-html-parser';

import { MAIN_BACKGROUND_IMAGE, FOOTBALL_IMAGE } from '../../utilities/constants';

import './help.scss';

const dataHelp = [
    {
        heading: 'What does this app do',
        details: [
            "This app allows you to play through a season's fixtures for a football league (e.g. English Premier League).",
            "The way it works is that for each minute of each fixture a random number is generated and if that number is within a certain tolerance then a goal is scored.",
            "You start by entering teams and various factors on the <span>Settings</span> page.  Once teams and factors have been entered (or the defaults used) then click on the <span>Latest Fixtures</span> page to start the first set of fixtures.",
        ]
    },
    {
        heading: 'What is Settings - Season and Season Start Date',
        details: [
            "<span>Season</span> just specifies the season in YYYY/YY format, and otherwise is not used in the app.",
            "<span>Season Start Date</span> must be a valid date and is used as a basepoint for all fixtures created by the <span>Create Season's Fixtures</span> button.",
        ]
    },
    {
        heading: 'What is Settings - Fixture Update Interval (seconds)',
        details: [
            "This setting sets the rate at which each fixture updates on the <span>Latest Fixtures</span> page.",
            "On the basis that a match lasts 90 minutes, then for each notional minute a check is done to see if a goal has been scored by either team.",
            "Rather then wait 90 minutes for the app to update, you can set <span>Fixture Update Interval (seconds)</span>.",
            "So, for example, a setting of 1 means it will take 90 seconds to complete a match, a setting of 0.5 means it will take 45 seconds.",
        ]
    },
    {
        heading: 'What is Settings - Base For Random Multiplier',
        details: [
            "The way the app works is that for a match lasting say 90 minutes, for each notional minute a check is done to see if a goal has been scored by either team.",
            "This check involves creating a random number and comparing it to a factor (i.e. <span>Is It A Goal Factor</span>).",
            "The random number is calculated using a base value (i.e. <span>Base For Random Multiplier</span>) and several other factors on the <span>Settings</span> page.",
            "Therefore the random number could be between 1 and 90 for a top team playing at home, or between 1 and 109 for a 'not top' team playing away (i.e. 90 x 1.1 x 1.1).",
        ]
    },
    {
        heading: 'What is Settings - Away Team Factor',
        details: [
            "This factor recognises that more games are won by the home team.",
            "Therefore, a factor of 1.1 for example means that the base factor (i.e. <span>Base For Random Multiplier</span>) is multiplied by this factor.",
            "Therefore a random number for home teams is generated from 0 to 90 and for away teams is 0 to 99 (i.e. 90 * 1.1).",
            "Note that 90 or 99 above is a simplification as other factors are taken into account as well.",
        ]
    },
    {
        heading: 'What is Settings - Is Not A Top Team Factor',
        details: [
            "This factor recognises that there are a few teams who are better than others and therefore more likely to win.",
            "Therefore, a factor of 1.1 for example means that the base factor (i.e. <span>Base For Random Multiplier</span>') is multiplied by this factor.",
            "Therefore a random number for top teams is generated from 0 to 90 and for other teams is 0 to 99 (i.e. 90 * 1.1).",
            "Note that 90 or 99 above is a simplification as other factors are taken into account as well.",
        ]
    },
    {
        heading: 'What is Settings - Goals per Minute Factor',
        details: [
            "This factor recognises that there periods of matches when a goal is more likely to be scored (e.g. it is more likely that a goal will be scored in the last 10 minutes than the first 10 minutes).",
            "The field is a series of objects within an array.  The format of each object is {'minutes': XX, 'factor': X.X}.",
            "Don't set the factor to more than 2 as the chances of a goal being scored will reduce significantly.",
            "Set the 'minutes' property of the final object to over 100 to allow for injury time to be played.",
        ]
    },
    {
        heading: 'What is Settings - Is It A Goal Factor',
        details: [
            "For each minute of each fixture a random number is generated for both the home and away team.",
            "This random number is generated based on a number of factors, i.e. base value multiplied by away team factor (if applicable), multiplied by not top team factor (if applicable), multiplied by goals per minute factor.",
            "if the value of the random number generated is less than or equal to the <span>Is It A Goal Factor</span> then a goal is scored.",
        ]
    },
    {
        heading: 'What is Settings - Reset App',
        details: [
            "Click on <span>Settings</span> in the main menu.",
            "Click on <span>Reset App</span>.",
            "When you use the system by saving values on the <span>Settings</span> page, creating fixtures, or running fixtures on the <span>Latest Fixtures</span> page, all these changes are saved to the local browser.",
            "The <span>Reset App</span> button will therefore remove all of this data and revert the app back to its default values.",
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