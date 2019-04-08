const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MyWatchlistTeamSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    userDocumentId: { type: String, required: true },
    teamName: { type: String, required: true },
});

module.exports = MyWatchlistTeam = mongoose.model('my-watchlist-team', MyWatchlistTeamSchema);