const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdminFactorsSchema = new Schema({
    userDocumentId: { type: String, required: true },
    season: { type: String, required: true },
    seasonStartDate: String,
    numberOfFixturesForSeason: Number,
    goalFactors: {
        isAwayTeam: Number,
        isNotATopTeam: Number,
        baseForRandomMultiplier: Number,
        likelihoodOfAGoalDuringASetPeriod: [{
            minutes: Number,
            factor: Number,
        }],
        isItAGoal: Number,
        fixtureUpdateInterval: Number
    }
});

module.exports = AdminFactors = mongoose.model('admin-factors', AdminFactorsSchema);