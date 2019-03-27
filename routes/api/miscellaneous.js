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
        hasCompetitionStarted: req.body.hasCompetitionStarted,
        hasCompetitionFinished: req.body.hasCompetitionFinished,
        competitionRoundForNextDraw: req.body.competitionRoundForNextDraw,
        competitionRoundForPlay: req.body.competitionRoundForPlay,
        okToProceedWithDraw: req.body.okToProceedWithDraw,
        haveFixturesForCompetitionRoundBeenPlayed: req.body.haveFixturesForCompetitionRoundBeenPlayed,
        haveFixturesProducedReplays: req.body.haveFixturesProducedReplays,
    });

    newMiscellaneous.save()
        .then(results => {
            const response = res.json(results);
            console.log(`${MODEL_NAME.toUpperCase()} - inserted - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
        })
        .catch(err => console.error(err))
});


// ***************** DELETE BY USER *******************
// @route DELETE api/miscellaneous/:id
// @desc  Delete an Miscellaneous document
// @access Public
router.delete('/:userDocumentId', (req, res) => {
    Miscellaneous.findOneAndDelete({ userDocumentId: req.params.userDocumentId })
        // .then(miscellaneous => miscellaneous.remove().then(() => res.json({success: true})))
        .then(() => res.json({success: true}))
        .catch(err => res.status(404).json({success: false}))
});


module.exports = router;