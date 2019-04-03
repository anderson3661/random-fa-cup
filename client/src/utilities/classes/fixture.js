import * as helpers from '../helper-functions/helpers';

import { DEFAULT_VALUE_COMPETITION_START_DATE, DEFAULT_VALUE_COMPETITION_START_TIME, DIVISIONS, SEMI_FINALS, FINAL,
         EXTRA_MINUTES_FIRST_HALF, EXTRA_MINUTES_SECOND_HALF, EXTRA_MINUTES_EXTRA_TIME_FIRST_HALF, EXTRA_MINUTES_EXTRA_TIME_SECOND_HALF,    
         HALF_TIME, HALF_TIME_IN_EXTRA_TIME, FULL_TIME, FULL_TIME_AFTER_90_MINUTES, FULL_TIME_AFTER_EXTRA_TIME, FULL_TIME_AFTER_PENALTIES} from '../constants';


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
    homeTeamsScoreAfter90Minutes;
    awayTeamsScoreAfter90Minutes
    homeTeamsScorePenalties;
    awayTeamsScorePenalties;
    homeTeamsGoals;
    awayTeamsGoals;
    isFirstHalf;
    isExtraTime;
    isPenalties;
    isHomeTeamTakingPenaltiesFirst;
    injuryTimeFirstHalf;
    injuryTimeSecondHalf;
    injuryTimeExtraTimeFirstHalf;
    injuryTimeExtraTimeSecondHalf;
    statutoryMinutes;
    maxNumberOfMinutes;
    minutesPlayed;
    minutesInfo;
    hasFixtureFinished;
    hasPenaltiesStarted;
    isReplay;
    penalties = []
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

    setUpFixture = (goalFactors) => {
        this.isFirstHalf = true;
        this.isExtraTime = false;
        this.isPenalties = false;
        this.hasFixtureFinished = false;
        this.hasPenaltiesStarted = false;
        this.minutesPlayed = 0;
        this.minutesInfo = '';

        this.injuryTimeFirstHalf = Math.floor(Math.random() * EXTRA_MINUTES_FIRST_HALF + 1);
        this.injuryTimeSecondHalf = Math.floor(Math.random() * EXTRA_MINUTES_SECOND_HALF + 1);
        this.injuryTimeExtraTimeFirstHalf = Math.floor(Math.random() * EXTRA_MINUTES_EXTRA_TIME_FIRST_HALF + 1);
        this.injuryTimeExtraTimeSecondHalf = Math.floor(Math.random() * EXTRA_MINUTES_EXTRA_TIME_SECOND_HALF + 1);

        // Goal Factors on the Settings screen needs to be a string, and here it is transposed into an array
        this.goalFactors = helpers.getGoalsPerMinuteFactors(goalFactors.likelihoodOfAGoalDuringASetPeriod, 'array');
    }

    startFixture = () => {
        //Set the scores to zero for the start of the fixture
        if (this.isFirstHalf && !this.isExtraTime) {
            this.homeTeamsScore = 0;
            this.awayTeamsScore = 0;
            this.homeTeamsScorePenalties = 0;
            this.awayTeamsScorePenalties = 0;
            this.homeTeamsGoals = "";
            this.awayTeamsGoals = "";
        }

        if (this.isPenalties) {
            this.minutesPlayed = 0;         // This records the number of penalties taken for each team
            this.penalties = [];
            this.hasPenaltiesStarted = true;
            this.isHomeTeamTakingPenaltiesFirst = helpers.whichTeamIsTakingPenaltiesFirst();
        } else if (this.isExtraTime) {
            this.statutoryMinutes = (this.isFirstHalf) ? 105 : 120;
            this.minutesPlayed = (this.isFirstHalf) ? 90 : 105;
            this.maxNumberOfMinutes = this.statutoryMinutes + ((this.isFirstHalf) ? this.injuryTimeExtraTimeFirstHalf : this.injuryTimeExtraTimeSecondHalf);
        } else {
            this.statutoryMinutes = (this.isFirstHalf) ? 45 : 90;
            this.minutesPlayed = (this.isFirstHalf) ? 0 : 45;
            this.maxNumberOfMinutes = this.statutoryMinutes + ((this.isFirstHalf) ? this.injuryTimeFirstHalf : this.injuryTimeSecondHalf);
        }
    }

    updateFixture = (teams, goalFactors, competitionRound) => {
        let i;
        let minutesinMatchFactor;
        let homeTeamUpdate;
        let awayTeamUpdate;
        let isFirstHalfBeforeUpdate;
        let penalty;
        let numberOfPenaltiesTaken;

        homeTeamUpdate = false;
        awayTeamUpdate = false;

        if (!this.hasFixtureFinished && this.isPenalties && this.minutesPlayed < 120) {

            // With penalties, each team takes one and then the screen re-renders
            this.minutesPlayed++;
            numberOfPenaltiesTaken = this.minutesPlayed;

            if (this.penalties.length === 0 ||
               (this.penalties.length > 0 && this.penalties[this.penalties.length - 1].hasHomeTeamTakenPenalty && this.penalties[this.penalties.length - 1].hasAwayTeamTakenPenalty)) {
                this.penalties.push({ hasHomeTeamTakenPenalty: false, hasHomeTeamScored: false, hasAwayTeamTakenPenalty: false, hasAwayTeamScored: false });
            }

            penalty = this.penalties[this.penalties.length - 1];
            if ((this.isHomeTeamTakingPenaltiesFirst && !penalty.hasHomeTeamTakenPenalty) || (!this.isHomeTeamTakingPenaltiesFirst && penalty.hasAwayTeamTakenPenalty)) {
                penalty.hasHomeTeamTakenPenalty = true;
                penalty.hasHomeTeamScored = this.hasTeamScored(teams, goalFactors, "home", 1, competitionRound);
            } else {
                penalty.hasAwayTeamTakenPenalty = true;
                penalty.hasAwayTeamScored = this.hasTeamScored(teams, goalFactors, "away", 1, competitionRound);
            }

            if (helpers.havePenaltiesForFixtureFinished(numberOfPenaltiesTaken, this.penalties, this.homeTeamsScorePenalties, this.awayTeamsScorePenalties, this.isHomeTeamTakingPenaltiesFirst)) {
                this.minutesInfo = FULL_TIME_AFTER_PENALTIES;
                this.hasFixtureFinished = true;
            }

        } else if (!this.isPenalties) {

            if (this.minutesPlayed < this.maxNumberOfMinutes) {

                minutesinMatchFactor = 0;

                for (i = 0; i < this.goalFactors.length; i++) {
                    if (this.minutesPlayed <= this.goalFactors[i].minutes) {
                        minutesinMatchFactor = this.goalFactors[i].factor;
                        break;
                    }
                }

                this.minutesPlayed++;

                if (this.minutesPlayed <= this.maxNumberOfMinutes) {
                    homeTeamUpdate = this.hasTeamScored(teams, goalFactors, "home", minutesinMatchFactor, competitionRound);
                    awayTeamUpdate = this.hasTeamScored(teams, goalFactors, "away", minutesinMatchFactor, competitionRound);
                    if (homeTeamUpdate && awayTeamUpdate) {
                        if (Math.floor(Math.random() * 2) === 0) {
                            this.homeTeamsGoals = this.homeTeamsGoals.trim() + "* "
                        } else {
                            this.awayTeamsGoals = this.awayTeamsGoals.trim() + "* "
                        }
                    }
                }

                isFirstHalfBeforeUpdate = this.isFirstHalf;         // Get a handle to whether it is the first half (as this is needed for the Goal 'typing' Updates), before it is updated below.

                //Check for half time or end of fixtures
                if (this.minutesPlayed === this.maxNumberOfMinutes) {
                    if (this.isFirstHalf && !this.isExtraTime) {
                        this.minutesInfo = HALF_TIME;
                        this.isFirstHalf = false;
                    } else if ((this.isReplay || this.competitionRound === SEMI_FINALS || this.competitionRound === FINAL) &&
                               !this.isExtraTime && this.homeTeamsScore === this.awayTeamsScore) {                 // Replays, Semi Finals and Final go to extra time and penalties
                        this.homeTeamsScoreAfter90Minutes = this.homeTeamsScore;
                        this.awayTeamsScoreAfter90Minutes = this.awayTeamsScore;
                        this.isFirstHalf = true;
                        this.isExtraTime = true;
                        this.minutesInfo = FULL_TIME_AFTER_90_MINUTES;
                    } else if (this.isExtraTime && this.isFirstHalf) {
                        this.isFirstHalf = false;
                        this.minutesInfo = HALF_TIME_IN_EXTRA_TIME;
                    } else if (this.isExtraTime && !this.isFirstHalf && !this.isPenalties) {
                        this.minutesInfo = FULL_TIME_AFTER_EXTRA_TIME;
                        if (this.homeTeamsScore === this.awayTeamsScore) {
                            this.isPenalties = true
                         } else {
                             this.hasFixtureFinished = true;
                         }
                    } else {
                        this.minutesInfo = FULL_TIME;
                        this.hasFixtureFinished = true;
                    }
                } else {
                    this.minutesInfo = this.minutesPlayed + ((this.minutesPlayed === 1) ? " min" : " mins");
                }

            }
        }

        return {homeTeamUpdate, awayTeamUpdate, isFirstHalfBeforeUpdate};
    }

    hasTeamScored = (teams, goalFactors, whichTeam, minutesinMatchFactor, competitionRound) => {
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
        
        // Semi Finals and Final are played on neutral grounds so no home team advantage
        if (competitionRound === SEMI_FINALS || competitionRound === FINAL) {
            awayTeamFactor = 1;
        } else {
            awayTeamFactor = (whichTeam === "home") ? 1 : goalFactors.isAwayTeam;
        }
        
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
        
        isItAGoalFactor = this.isPenalties ? goalFactors.isItAGoalFromAPenalty : goalFactors.isItAGoal;

        // Has a goal been scored
        if (Math.floor(Math.random() * goalFactors.baseForRandomMultiplier * minutesinMatchFactor * awayTeamFactor * isNotATopTeamFactor * divisionFactor) < isItAGoalFactor) {

            if (this.isPenalties) {

                this[whichTeam + "TeamsScorePenalties"] += 1;
                return true;        // Return true to update the penalties array

            } else {

                this[whichTeam + "TeamsScore"] += 1;

                if (this.minutesPlayed > this.statutoryMinutes) {
                    this[whichTeam + "TeamsGoals"] += this.statutoryMinutes.toString() + "(+" + (this.minutesPlayed - this.statutoryMinutes).toString() + ")  ";
                } else {
                    this[whichTeam + "TeamsGoals"] += this.minutesPlayed + "  ";
                }

                return true       // Return true to re-display
            }
        }
        return false;
    }

}