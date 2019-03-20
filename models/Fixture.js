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
    homeTeamsGoals: String,
    awayTeamsGoals: String,
    injuryTimeFirstHalf: Number,
    injuryTimeSecondHalf: Number,
    minutesPlayed: Number,
    hasFixtureFinished: Boolean,
    isReplay: Boolean,
    dateOfFixture: String,
    timeOfFixture: String,
});

module.exports = Fixture = mongoose.model('fixture', FixtureSchema);