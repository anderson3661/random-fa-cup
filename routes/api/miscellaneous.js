const express = require('express');
const router = express.Router();

const MODEL_NAME = 'miscellaneous';

//Miscellaneous Model
const Miscellaneous = require('../../models/Miscellaneous');


// ***************** GET *******************
// @route GET api/miscellaneous
// @desc  Get all Miscellaneous documents (should only be 1)
// @access Public
router.get('/:userDocumentId', (req, res) => {
    Miscellaneous.find({ userDocumentId: req.params.userDocumentId })
        .then(results => res.json(results))
});


// ***************** GET (NOT USED) *******************
// @route GET api/miscellaneous
// @desc  Get all Miscellaneous documents (should only be 1)
// @access Public
// router.get('/', (req, res) => {
//     Miscellaneous.find()
//         // .sort({ date: -1 })
//         .then(miscellaneous => res.json(miscellaneous))
// });


// ***************** PUT *******************
// @route PUT (or POST/PATCH) api/miscellaneous/:id
// @desc  Update the Miscellaneous document
// @access Public
router.put('/:id', (req, res) => {

    Miscellaneous.findOneAndUpdate({ _id: req.params.id}, req.body)
        .then(results => {
            const response = res.json(results);
            console.log(`${MODEL_NAME.toUpperCase()} - updated - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
        })
        .catch(err => console.error(err))
});


// ***************** POST *******************
// @route POST api/miscellaneous
// @desc  Create a Miscellaneous document
// @access Public
router.post('/', (req, res) => {
    const newMiscellaneous = new Miscellaneous({
        userDocumentId: req.body.userDocumentId,
        haveSeasonsFixturesBeenCreated: req.body.haveSeasonsFixturesBeenCreated,
        hasSeasonStarted: req.body.hasSeasonStarted,
        hasSeasonFinished: req.body.hasSeasonFinished,
        dateOfLastSetOfFixtures: req.body.dateOfLastSetOfFixtures,
        numberOfTeams: req.body.numberOfTeams,
    });

    newMiscellaneous.save()
        .then(results => {
            const response = res.json(results);
            console.log(`${MODEL_NAME.toUpperCase()} - inserted - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
        })
        .catch(err => console.error(err))
});


// ***************** DELETE BY USER *******************
// @route DELETE api/admin-factors/:id
// @desc  Delete an Admin Factor document
// @access Public
router.delete('/:userDocumentId', (req, res) => {
    Miscellaneous.findOneAndDelete({ userDocumentId: req.params.userDocumentId })
        // .then(miscellaneous => miscellaneous.remove().then(() => res.json({success: true})))
        .then(() => res.json({success: true}))
        .catch(err => res.status(404).json({success: false}))
});


// ***************** DELETE ALL (NOT USED) *******************
// @route DELETE api/miscellaneous
// @desc  Delete all Miscellaneous documents
// @access Public
// router.delete('/', (req, res) => {
//     // Return success true or false as the http response
//     Miscellaneous.deleteMany({}, err => err ? res.status(404).json({success: false}) : res.json({success: true}))
// });


module.exports = router;