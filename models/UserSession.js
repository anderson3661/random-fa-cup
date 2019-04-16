const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSessionSchema = new Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    userId: { type: String, default: -1 },
    timeStamp: { type: Date, default: Date.now() },
    isDeleted: { type: Boolean, default: false },
});

UserSessionSchema.methods.createUserSession = (userSession, res, user, message) => {
    userSession.userId = user._id;

    userSession.save((err, userSessionDoc) => {
        if (err) return res.send({ success: false, message: 'Error: Server error' });

        return res.send({ success: true, message: message, userId: user._id, token: userSessionDoc._id });
    });
};



module.exports = UserSession = mongoose.model('user-session', UserSessionSchema);