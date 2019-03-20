import * as helpers from '../helper-functions/helpers';

import { DEFAULT_VALUE_COMPETITION_START_DATE, DEFAULT_VALUE_COMPETITION_START_TIME, DIVISIONS } from '../constants';

const EXTRA_MINUTES_FIRST_HALF = 5;
const EXTRA_MINUTES_SECOND_HALF = 9;

const HALF_TIME = "Half-Time";
const FULL_TIME = "Full-Time";


export class Fixture {

    _id;
    competitionRound;
    dateOfFixture;
    timeOfFixture;
    homeTeam;
    awayTeam;
    homeTeamDivision;
    awayTeamDivision;
    homeTeamsScore;
    awayTeamsScore;
    homeTeamsGoals = "";
    awayTeamsGoals;
    isFirstHalf;
    injuryTimeFirstHalf;
    injuryTimeSecondHalf;
    statutoryMinutes;
    maxNumberOfMinutes;
    minutesPlayed;
    minutesInfo;
    hasFixtureFinished;
    isReplay;

    goalFactors;
    props;


    constructor(fixture) {
        this._id = fixture._id;
        this.dateOfFixture = DEFAULT_VALUE_COMPETITION_START_DATE;
        this.timeOfFixture = DEFAULT_VALUE_COMPETITION_START_TIME;
        this.homeTeam = fixture.homeTeam;
        this.awayTeam = fixture.awayTeam;
        this.homeTeamDivision = fixture.homeTeamDivision;
        this.awayTeamDivision = fixture.awayTeamDivision;
        this.competitionRound = fixture.competitionRound;
        this.isReplay = fixture.isReplay;
    }

    getFixtureObject() {
        return {
            _id: this._id,
            competitionRound: this.competitionRound,
            dateOfFixture: this.dateOfFixture,
            timeOfFixture: this.timeOfFixture,
            homeTeam: this.homeTeam,
            awayTeam: this.awayTeam,
            homeTeamDivision: this.homeTeamDivision,
            awayTeamDivision: this.awayTeamDivision,
            homeTeamsScore: this.homeTeamsScore,
            awayTeamsScore: this.awayTeamsScore,
            homeTeamsGoals: this.homeTeamsGoals,
            awayTeamsGoals: this.awayTeamsGoals,
            injuryTimeFirstHalf: this.injuryTimeFirstHalf,
            injuryTimeSecondHalf: this.injuryTimeSecondHalf,
            minutesPlayed: this.minutesPlayed,
            minutesInfo: this.minutesInfo,
            hasFixtureFinished: this.hasFixtureFinished,
            isReplay: this.isReplay,
        }
    }

    setUpFixture(goalFactors) {
        this.isFirstHalf = true;
        this.hasFixtureFinished = false;
        this.minutesPlayed = 0;
        this.minutesInfo = '';

        this.injuryTimeFirstHalf = Math.floor(Math.random() * EXTRA_MINUTES_FIRST_HALF + 1);
        this.injuryTimeSecondHalf = Math.floor(Math.random() * EXTRA_MINUTES_SECOND_HALF + 1);

        // Goal Factors on the Administration screen needs to be a string, and here it is transposed into an array
        this.goalFactors = helpers.getGoalsPerMinuteFactors(goalFactors.likelihoodOfAGoalDuringASetPeriod, 'array');
    }

    startFixture(haveFixturesBeenPaused) {
        //Set the scores to zero for the start of the fixture
        if (this.isFirstHalf) {
            this.homeTeamsScore = 0;
            this.awayTeamsScore = 0;
            this.homeTeamsGoals = "";
            this.awayTeamsGoals = "";
        }

        this.statutoryMinutes = (this.isFirstHalf) ? 45 : 90;
        this.minutesPlayed = (this.isFirstHalf) ? 0 : 45;
        this.maxNumberOfMinutes = this.statutoryMinutes + ((this.isFirstHalf) ? this.injuryTimeFirstHalf : this.injuryTimeSecondHalf);
    }

    updateFixture(teams, goalFactors) {
        let i;
        // let updateTable;
        let minutesinMatchFactor;
        let homeTeamUpdate;
        let awayTeamUpdate;
        let isFirstHalfBeforeUpdate;

        // updateTable = false;
        homeTeamUpdate = false;
        awayTeamUpdate = false;

        if (this.minutesPlayed < this.maxNumberOfMinutes) {

            minutesinMatchFactor = 0;

            // for (i = 0; i < this.goalFactors[0].length; i++) {
            for (i = 0; i < this.goalFactors.length; i++) {
                // if (this.minutesPlayed <= this.goalFactors[0][i].minutes) {
                if (this.minutesPlayed <= this.goalFactors[i].minutes) {
                    // minutesinMatchFactor = this.goalFactors[0][i].factor;
                    minutesinMatchFactor = this.goalFactors[i].factor;
                    break;
                }
            }

            this.minutesPlayed++;

            if (this.minutesPlayed <= this.maxNumberOfMinutes) {
                homeTeamUpdate = this.hasTeamScored(teams, goalFactors, "home", minutesinMatchFactor);
                awayTeamUpdate = this.hasTeamScored(teams, goalFactors, "away", minutesinMatchFactor);
            }

            isFirstHalfBeforeUpdate = this.isFirstHalf;         // Get a handle to whether it is the first half (as this is needed for the Goal 'typing' Updates), before it is updated below.

            //Check for half time or end of fixtures
            if (this.minutesPlayed === this.maxNumberOfMinutes) {
                if (this.isFirstHalf) {
                    this.minutesInfo = HALF_TIME;
                    this.isFirstHalf = false;
                } else {
                    this.minutesInfo = FULL_TIME;
                    this.hasFixtureFinished = true;
                }
            } else {
                this.minutesInfo = this.minutesPlayed + ((this.minutesPlayed === 1) ? " min" : " mins");
            }

        }

        // if (updateTable) {
            // debugger;
        // }

        return {homeTeamUpdate, awayTeamUpdate, isFirstHalfBeforeUpdate};
    }

    hasTeamScored(teams, goalFactors, whichTeam, minutesinMatchFactor) {
        let thisTeam;
        let oppositionTeam;
        let awayTeamFactor;
        let isNotATopTeamFactor;
        let isThisTeamATopTeam;
        let isOppositionTeamATopTeam;
        let divisionFactor;
        let thisTeamsDivision;
        let oppositionTeamsDivision;
        let isItAGoalFactor;

        
        awayTeamFactor = (whichTeam === "home") ? 1 : goalFactors.isAwayTeam;
        
        thisTeam = this[whichTeam + "Team"];
        oppositionTeam = this[(whichTeam === "home" ? "away" : "home") + "Team"];

        // If both teams are or are not 'top teams', then don't apply the 'Is Top Team' factor
        isThisTeamATopTeam = teams[helpers.getPositionInArrayOfObjects(teams, "teamName", thisTeam)].isATopTeam;
        isOppositionTeamATopTeam = teams[helpers.getPositionInArrayOfObjects(teams, "teamName", oppositionTeam)].isATopTeam;
        isNotATopTeamFactor = (isThisTeamATopTeam || (isThisTeamATopTeam === isOppositionTeamATopTeam)) ? 1 : goalFactors.isNotATopTeam;
        
        // Apply the 'Division' factor - if teams are in the same division then don't apply, otherwise the factor applies for each difference in division
        divisionFactor = 1;
        thisTeamsDivision = DIVISIONS.indexOf(helpers.getDivisionTheTeamPlaysIn(teams, thisTeam));
        oppositionTeamsDivision = DIVISIONS.indexOf(helpers.getDivisionTheTeamPlaysIn(teams, oppositionTeam));
        if (thisTeamsDivision > oppositionTeamsDivision) {
            for (let i = 0; i < (thisTeamsDivision - oppositionTeamsDivision); i++) {
                divisionFactor *= goalFactors.divisionFactor;
            }
        }
        
        isItAGoalFactor = goalFactors.isItAGoal;

        // Has a goal been scored
        if (Math.floor(Math.random() * goalFactors.baseForRandomMultiplier * minutesinMatchFactor * awayTeamFactor * isNotATopTeamFactor * divisionFactor) < isItAGoalFactor) {

            this[whichTeam + "TeamsScore"] += 1;

            if (this.minutesPlayed > this.statutoryMinutes) {
                this[whichTeam + "TeamsGoals"] += this.statutoryMinutes.toString() + "(+" + (this.minutesPlayed - this.statutoryMinutes).toString() + ")  ";
            } else {
                this[whichTeam + "TeamsGoals"] += this.minutesPlayed + "  ";
            }

            return true       // Return true to re-display
        }
        return false;
    }

}