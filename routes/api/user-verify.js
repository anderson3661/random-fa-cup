const express = require('express');
const router = express.Router();

//User Model
const UserSession = require('../../models/UserSession');


// ***************** POST *******************
// @route POST api/user/verify
// @desc  Verify User Session

router.get('/', (req, res, next) => {
    const { query } = req;
    const { token } = query;

    UserSession.find(
        {
            _id: token,
            isDeleted: false
        },
        (err, userSessions) => {
            if (err) {
                if (err.message.startsWith("Cast to ObjectId failed for value")) {
                    return res.send({ success: false, message: 'Error: Invalid token' });
                } else {
                    return res.send({ success: false, message: 'Error: Server error' });
                }
            }

            if (userSessions.length === 0) {
                return res.send({ success: false, message: 'Error: Invalid ... there are no active user sessions' });
            } else if (userSessions.length > 1) {
                return res.send({ success: false, message: 'Error: Invalid ... there are more than one active user sessions' });
            } else {
                return res.send({ success: true, message: 'User Session Valid' });
            }
        }
    );
});


module.exports = router;