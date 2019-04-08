const express = require('express');
const router = express.Router();

//User Model
const User = require('../../models/User');
const UserSession = require('../../models/UserSession');


// ***************** POST *******************
// @route POST api/user/logout
// @desc  User Logout

router.post('/', (req, res, next) => {
    const { query } = req;
    const { token } = query;

    UserSession.findOneAndUpdate(
        {
            _id: token,
            isDeleted: false
        },
        { $set: { isDeleted: true } },
        { new: true },
        (err, userSession) => {
            if (err) {
                if (err.message.startsWith("Cast to ObjectId failed for value")) {
                    return res.send({ success: false, message: 'Error: Invalid token' });
                } else {
                    return res.send({ success: false, message: 'Error: Server error' });
                }
            }

            if (!userSession) {
                return res.send({ success: false, message: 'Error: Unable to update and end active user session' });
            } else {
                return res.send({ success: true, message: 'User Logged Out' });
            }                
        }
    );
});


module.exports = router;