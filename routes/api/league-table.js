const express = require('express');
const router = express.Router();

const MODEL_NAME = 'league-table';

//Table Model
const LeagueTable = require('../../models/LeagueTable');


// ***************** GET *******************
// @route GET api/league-table
// @desc  Get all League Table documents
// @access Public
router.get('/:userDocumentId', (req, res) => {
    LeagueTable.find({ userDocumentId: req.params.userDocumentId })
        .then(results => res.json(results))
});


// ***************** GET (NOT USED) *******************
// @route GET api/league-table
// @desc  Get all League Table documents
// @access Public
router.get('/', (req, res) => {
    LeagueTable.find()
        // .sort({ date: -1 })
        .then(leagueTable => res.json(leagueTable))
});


// ***************** PUT *******************
// @route PUT (or POST/PATCH) api/league-table
// @desc  Update Leage Table documents using bulkWrite
// @access Public
router.put('/', (req, res) => {
    LeagueTable.bulkWrite(req.body)
        .then(results => {
            const response = res.json(results);
            console.log(`${MODEL_NAME.toUpperCase()} - bulk write - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
            console.log(`${MODEL_NAME.toUpperCase()} - bulk write - results - ok: ${results.result.ok}, number modified: ${results.modifiedCount}`);
        })
        // .catch(err => res.status(404).json({success: false}))
        .catch(err => console.error(err))
});


// ***************** POST *******************
// @route POST api/league-table
// @desc  Create League Table documents using bulkWrite
// @access Public
router.post('/', (req, res) => {
    LeagueTable.bulkWrite(req.body)
    .then(results => {
        const response = res.json(results);
        console.log(`${MODEL_NAME.toUpperCase()} - bulk write - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
        console.log(`${MODEL_NAME.toUpperCase()} - bulk write - results - ok: ${results.result.ok}, number inserted: ${results.insertedCount}`);
    })
    .catch(err => console.error(err));
});


// ***************** POST (UNUSED) *******************
// @route POST api/league-table
// @desc  Create a League Table document
// @access Public
// router.post('/', (req, res) => {
//     const newTable = new Table({
//         teamName: req.body.teamName,
//         played: req.body.played,
//         won: req.body.won,
//         drawn: req.body.drawn,
//         lost: req.body.lost,
//         goalsFor:req.body.goalsFor,
//         goalsAgainst: req.body.goalsAgainst,
//         goalDifference: req.body.goalDifference,
//         form: req.body.form,
//         homeWon: req.body.homeWon,
//         homeDrawn: req.body.homeDrawn,
//         homeLost: req.body.homeLost,
//         homeGoalsFor: req.body.homeGoalsFor,
//         homeGoalsAgainst: req.body.homeGoalsAgainst,
//         awayWon: req.body.awayWon,
//         awayDrawn: req.body.awayDrawn,
//         awayLost: req.body.awayLost,
//         awayGoalsFor: req.body.awayGoalsFor,
//         awayGoalsAgainst: req.body.awayGoalsAgainst,
//         points: req.body.points,
//     });

//     newTable.save().then(table => res.json(table));
// });


// ***************** DELETE BY USER *******************
// @route DELETE api/league-table/:id
// @desc  Delete a League Table document
// @access Public
router.delete('/:userDocumentId', (req, res) => {
    LeagueTable.deleteMany({ userDocumentId: req.params.userDocumentId })
    // .then(leagueTable => leagueTable.remove().then(() => res.json({success: true})))
    .then(() => res.json({success: true}))
    .catch(err => res.status(404).json({success: false}))
});


// ***************** DELETE ALL (NOT USED) *******************
// @route DELETE api/league-table
// @desc  Delete all League Table documents
// @access Public
// router.delete('/', (req, res) => {
//     // Return success true or false as the http response
//     LeagueTable.deleteMany({}, err => err ? res.status(404).json({success: false}) : res.json({success: true}))
// });


module.exports = router;