const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    emailAddress: { type: String, required: true },
    password: String
});

module.exports = User = mongoose.model('user', UserSchema);