const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SettingsFactorsSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    userDocumentId: { type: String, required: true },
    season: { type: String, required: true },
    competitionStartDate: String,
    goalFactors: {
        isAwayTeam: Number,
        isNotATopTeam: Number,
        divisionFactor: Number,
        baseForRandomMultiplier: Number,
        likelihoodOfAGoalDuringASetPeriod: [{
            minutes: Number,
            factor: Number,
        }],
        isItAGoal: Number,
        isItAGoalFromAPenalty: Number,
        fixtureUpdateInterval: Number
    }
});

module.exports = SettingsFactors = mongoose.model('settings-factors', SettingsFactorsSchema);