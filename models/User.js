const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    emailAddress: { type: String, required: true },
    password: { type: String, required: true },
});

module.exports = User = mongoose.model('user', UserSchema);