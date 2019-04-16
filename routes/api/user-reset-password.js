const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const { isValidUser, isValidReqBody } = require('./api-helpers');


// ***************** POST *******************
// @route POST api/user/reset-password
// @desc  User Reset Password

router.post('/', (req, res, next) => {
    let { emailAddress } = req.body;
    const { password } = req.body;

    if (!isValidReqBody(res, emailAddress, password)) return;
    
    emailAddress = emailAddress.toLowerCase();
    
    User.find(
        {
            emailAddress: emailAddress
        },
        (err, usersWithThisEmailAddress) => {
            if (!isValidUser(res, err, usersWithThisEmailAddress)) return;
           
            const user = usersWithThisEmailAddress[0];
            user.password = user.generateHash(password);
            
            user.save((err, userDoc) => {
                if (err) return res.send({ success: false, message: 'Error: Server error' });

                const userSession = new UserSession();
                userSession.createUserSession(userSession, res, userDoc, 'User Password Reset');
            });
        }
    );
});


module.exports = router;