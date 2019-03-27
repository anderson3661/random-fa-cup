const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// dateOfFixture: { type: Date, default: Date.now },

const FixtureSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    userDocumentId: { type: String, required: true },
    competitionRound: { type: String, required: true },
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    homeTeamDivision: { type: String, required: true },
    awayTeamDivision: { type: String, required: true },
    homeTeamsScore: Number,
    awayTeamsScore: Number,
    homeTeamsScoreAfter90Minutes: Number,
    awayTeamsScoreAfter90Minutes: Number,
    homeTeamsScorePenalties: Number,
    awayTeamsScorePenalties: Number,
    homeTeamsGoals: String,
    awayTeamsGoals: String,
    injuryTimeFirstHalf: Number,
    injuryTimeSecondHalf: Number,
    injuryTimeExtraTimeFirstHalf: Number,
    injuryTimeExtraTimeSecondHalf: Number,
    minutesPlayed: Number,
    hasFixtureFinished: Boolean,
    isReplay: Boolean,
    isExtraTime: Boolean,
    isPenalties: Boolean,
    penalties: Array,
    goalFactors: Array,
    dateOfFixture: String,
    timeOfFixture: String,
});

module.exports = Fixture = mongoose.model('fixture', FixtureSchema);