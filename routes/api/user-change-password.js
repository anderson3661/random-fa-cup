const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const { isValidUser, isValidReqBody } = require('./api-helpers');
const IS_CHANGE_PASSWORD = true;


// ***************** POST *******************
// @route POST api/user/change-password
// @desc  User Change Password

router.post('/', (req, res, next) => {
    let { emailAddress } = req.body;
    const { oldPassword, password } = req.body;

    if (!isValidReqBody(res, emailAddress, password, oldPassword, IS_CHANGE_PASSWORD)) return;
    
    emailAddress = emailAddress.toLowerCase();
    
    User.find(
        {
            emailAddress: emailAddress
        },
        (err, usersWithThisEmailAddress) => {
            if (!isValidUser(res, err, usersWithThisEmailAddress)) return;

            const user = usersWithThisEmailAddress[0];

            if (!user.validPassword(oldPassword)) {
                return res.send({ success: false, message: 'Error: Invalid old password' });
            }
                   
            user.password = user.generateHash(password);

            user.save((err, userDoc) => {
                if (err) return res.send({ success: false, message: 'Error: Server error' });

                const userSession = new UserSession();
                userSession.createUserSession(userSession, res, userDoc, 'User Password Changed');
            });
        }
    );
});


module.exports = router;