const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MiscellaneousSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    userDocumentId: { type: String, required: true },
    hasCompetitionStarted: Boolean,
    hasCompetitionFinished: Boolean,
    competitionRoundForNextDraw: String,
    competitionRoundForPlay: String,
    okToProceedWithDraw: Boolean,
    haveFixturesForCompetitionRoundBeenPlayed: Boolean,
    haveFixturesProducedReplays: Boolean,
});

module.exports = Miscellaneous = mongoose.model('miscellaneous', MiscellaneousSchema);