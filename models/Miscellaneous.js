const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MiscellaneousSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    userDocumentId: { type: String, required: true },
    haveRound1FixturesBeenCreated: Boolean,
    hasCompetitionStarted: Boolean,
    hasCompetitionFinished: Boolean,
});

module.exports = Miscellaneous = mongoose.model('miscellaneous', MiscellaneousSchema);