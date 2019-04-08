const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    emailAddress: { type: String, required: true },
    password: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
});

UserSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    // Can't be an arrow function, as requires access to this, so compareSync fails
    return bcrypt.compareSync(password, this.password);
};

module.exports = User = mongoose.model('user', UserSchema);