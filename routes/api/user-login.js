const express = require('express');
const router = express.Router();

//User Model
const User = require('../../models/User');
const UserSession = require('../../models/UserSession');


// ***************** POST *******************
// @route POST api/user/login
// @desc  User Login

router.post('/', (req, res, next) => {
    const { body } = req;
    let { emailAddress } = body;
    const { password } = body;

    if (!emailAddress) return res.send({ success: false, message: 'Error: Email Address must be entered' });
    if (!password) return res.send({ success: false, message: 'Error: Password must be entered' });
    
    emailAddress = emailAddress.toLowerCase();
    
    User.find(
        {
            emailAddress: emailAddress
        },
        (err, users) => {
            if (err) {
                return res.send({ success: false, message: 'Error: Server error' });
            } else if (users.length === 0) {
                return res.send({ success: false, message: 'Error: A user with this email address does not exist' });
            } else if (users.length > 1) {
                return res.send({ success: false, message: 'Error: There are multiple users with this email address' });
            }
                
            const user = users[0];
            if (!user.validPassword(password)) {
                return res.send({ success: false, message: 'Error: Invalid password' });
            }

            const userSession = new UserSession();
            userSession.userId = user._id;
            
            userSession.save((err, doc) => {
                if (err) return res.send({ success: false, message: 'Error: Server error' });

                return res.send({ success: true, message: 'User Logged In', userId: user._id, token: doc._id });
            });        
        }
    );
});


module.exports = router;