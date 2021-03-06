const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const { isValidUser, isValidReqBody } = require('./api-helpers');
const IS_SIGNUP = true;


// ***************** POST *******************
// @route POST api/user/sign-up
// @desc  User Sign-up

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
            if (!isValidUser(res, err, usersWithThisEmailAddress, IS_SIGNUP)) return;
                    
            const newUser = new User();
            newUser.emailAddress = emailAddress;
            newUser.password = newUser.generateHash(password);
            
            newUser.save((err, user) => {
                if (err) return res.send({ success: false, message: 'Error: Server error' });

                const userSession = new UserSession();
                userSession.createUserSession(userSession, res, user, 'User Signed Up');
            });
        }
    );
});


module.exports = router;