const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// dateOfFixture: { type: Date, default: Date.now },

const FixtureSchema = new Schema({
    userDocumentId: { type: String, required: true },
    setOfFixturesNumber: Number,
    fixtureNumber: Number,
    dateOfFixture: { type: String, required: true },
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    homeTeamsScore: Number,
    awayTeamsScore: Number,
    homeTeamsGoals: String,
    awayTeamsGoals: String,
    injuryTimeFirstHalf: Number,
    injuryTimeSecondHalf: Number,
    minutesPlayed: Number,
    hasFixtureFinished: Boolean,
});

module.exports = Fixture = mongoose.model('fixture', FixtureSchema);