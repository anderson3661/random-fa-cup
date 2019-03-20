const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    userDocumentId: { type: String, required: true },
    teamName: { type: String, required: true },
    isATopTeam: Boolean,
    division: { type: String, required: true },
});

module.exports = Team = mongoose.model('team', TeamSchema);