const express = require('express');
const router = express.Router();

//User Model
const User = require('../../models/User');


// ***************** POST *******************
// @route POST api/user/sign-up
// @desc  User Sign-up

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
        (err, usersWithThisEmailAddress) => {
            if (err) {
                return res.send({ success: false, message: 'Error: Server error' });
            } else if (usersWithThisEmailAddress.length > 0) {
                return res.send({ success: false, message: 'Error: There is already a user with this email address' });
            }
                    
            const newUser = new User();
            newUser.emailAddress = emailAddress;
            newUser.password = newUser.generateHash(password);
            
            newUser.save((err, user) => {
                if (err) return res.send({ success: false, message: 'Error: Server error' });

                return res.send({ success: true, message: 'User Signed Up', userId: newUser._id,  });
            });        
        }
    );
});


module.exports = router;