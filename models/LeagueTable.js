const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LeagueTableSchema = new Schema({
    userDocumentId: { type: String, required: true },
    teamName: { type: String, required: true },
    played: Number,
    won: Number,
    drawn: Number,
    lost: Number,
    goalsFor: Number,
    goalsAgainst: Number,
    goalDifference: Number,
    form: Array,
    homeWon: Number,
    homeDrawn: Number,
    homeLost: Number,
    homeGoalsFor: Number,
    homeGoalsAgainst: Number,
    awayWon: Number,
    awayDrawn: Number,
    awayLost: Number,
    awayGoalsFor: Number,
    awayGoalsAgainst: Number,
    points: Number,
});

//Need to call the model tables rather than table, presumably because table is a reserved word
module.exports = LeagueTable = mongoose.model('league-table', LeagueTableSchema);