const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    userDocumentId: { type: String, required: true },
    teamName: { type: String, required: true },
    isATopTeam: Boolean
});

module.exports = Team = mongoose.model('team', TeamSchema);