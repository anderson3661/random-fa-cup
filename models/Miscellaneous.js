const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MiscellaneousSchema = new Schema({
    userDocumentId: { type: String, required: true },
    haveSeasonsFixturesBeenCreated: Boolean,
    hasSeasonStarted: Boolean,
    hasSeasonFinished: Boolean,
    dateOfLastSetOfFixtures: String,
    numberOfTeams: Number,
});

module.exports = Miscellaneous = mongoose.model('miscellaneous', MiscellaneousSchema);