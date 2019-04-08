const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSessionSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    userId: { type: String, default: -1 },
    timeStamp: { type: Date, default: Date.now() },
    isDeleted: { type: Boolean, default: false },
});

module.exports = UserSession = mongoose.model('user-session', UserSessionSchema);