const express = require('express');
const router = express.Router();

const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const { isValidUser, isValidReqBody } = require('./api-helpers');


// ***************** POST *******************
// @route POST api/user/login
// @desc  User Login

router.post('/', (req, res, next) => {
    let { emailAddress } = req.body;
    const { password } = req.body;

    if (!isValidReqBody(res, emailAddress, password)) return;
    
    emailAddress = emailAddress.toLowerCase();
    
    User.find(
        {
            emailAddress: emailAddress
        },
        (err, users) => {
            if (!isValidUser(res, err, users)) return;
                
            const user = users[0];
            if (!user.validPassword(password)) {
                return res.send({ success: false, message: 'Error: Invalid password' });
            }

            const userSession = new UserSession();
            userSession.createUserSession(userSession, res, user, 'User Logged In');
        }
    );
});


module.exports = router;