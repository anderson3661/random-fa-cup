const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//User Model
const User = require('../../models/User');


// ***************** GET *******************
// @route GET api/users
// @desc  Get all user documents
// @access Public
router.get('/', (req, res) => {
    User.find()
        .then(users => {
            return res.json(users)
        })
});


// ***************** GET (BY EMAIL ADDRESS) *******************
// @route GET api/users
// @desc  Get all user documents
// @access Public
router.get('/:emailAddress', (req, res) => {
    User.findOne({ emailAddress: req.params.emailAddress })
        .then(user => {
            return res.json(user)
        })
});


// ***************** PUT *******************
// @route PUT (or PATCH) api/users/
// @desc  Update user documents
// @access Public
router.put('/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => user.save().then(() => res.json({success: true})))        
    .catch(err => res.status(404).json({success: false}))
});


// ***************** POST *******************
// @route POST api/users
// @desc  Create user documents
// @access Public
router.post('/', (req, res) => {
    const newUser = new User({
                    // _id: mongoose.Types.ObjectId(),
                    emailAddress: req.body.emailAddress,
                    password: req.body.password,
                });
                newUser.save()
                .then(user => {
                    // console.log(res.json(user));
                    return res.json(user);
                })
                .catch(err => console.error(err));

    // bcrypt.hash(req.body.password, 10, (err, hash) => {
    //     if (err) {
    //         return res.status(500).json({ error: err });
    //     } else {
    //         const newUser = new User({
    //             _id: mongoose.Types.ObjectId(),
    //             emailAddress: req.body.emailAddress,
    //             password: hash,
    //         });
    //         newUser.save()
    //         .then(user => {
    //             // console.log(res.json(user));
    //             return res.json(user);
    //         })
    //         .catch(err => console.error(err));
    //     }
    // });
});


// ***************** DELETE *******************
// @route DELETE api/users
// @desc  Delete all users
// @access Public
// router.delete('/', (req, res) => {
//     // Return success true or false as the http response
//     User.deleteMany({}, err => err ? res.status(404).json({success: false}) : res.json({success: true}))
// });


// ***************** DELETE (UNUSED) *******************
// @route DELETE api/users/:id
// @desc  Delete a user
// @access Public
// router.delete('/:id', (req, res) => {
    // User.findById(req.params.id)
    // .then(user => user.remove().then(() => res.json({success: true})))        
    // .catch(err => res.status(404).json({success: false}))


module.exports = router;