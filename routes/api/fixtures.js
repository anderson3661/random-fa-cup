const express = require('express');
const router = express.Router();

const MODEL_NAME = 'fixture';

//Fixture Model
const Fixture = require('../../models/Fixture');


// ***************** GET *******************
// @route GET api/fixtures
// @desc  Get all fixture documents
// @access Public
router.get('/:userDocumentId', (req, res) => {
    Fixture.find({ userDocumentId: req.params.userDocumentId })
        .then(results => res.json(results))
});


// ***************** GET (NOT USED) *******************
// @route GET api/fixtures
// @desc  Get all fixture documents
// @access Public
// router.get('/', (req, res) => {
//     Fixture.find()
//         // .sort({ date: -1 })
//         .then(fixtures => res.json(fixtures))
// });


// ***************** PUT *******************
// @route PUT (or POST/PATCH) api/fixtures
// @desc  Update fixture documents using bulkWrite
// @access Public
// router.put('/:id', (req, res) => {    
router.put('/', (req, res) => {

    Fixture.bulkWrite(req.body)
    .then(results => {
        const temp = res.json(results);
        console.log(`${MODEL_NAME.toUpperCase()} - bulk write - response - statusCode: ${temp.statusCode}, statusMessage: ${temp.statusMessage}`);
        console.log(`${MODEL_NAME.toUpperCase()} - bulk write - results - ok: ${results.result.ok}, number modified: ${results.modifiedCount}`);
    })
    // .catch(err => res.status(404).json({success: false}))
    .catch(err => console.error(err))
});


// ***************** PUT (UNUSED) *******************
// router.put('/:id', (req, res) => {
//     console.log('Starting');
//     console.log(req.params.id);
//     console.log(req.body);

//     Fixture.findOneAndUpdate({ _id: req.params.id}, req.body)
//         // .then(fixture => fixture.save())
//         .then(fixture => console.log(fixture))
//         .catch(err => console.error(err))
// });


// ***************** POST *******************
// @route POST api/table
// @desc  Create table documents using bulkWrite
// @access Public
router.post('/', (req, res) => {
    Fixture.bulkWrite(req.body)
    .then(results => {
        const response = res.json(results);
        console.log(`${MODEL_NAME.toUpperCase()} - bulk write - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
        console.log(`${MODEL_NAME.toUpperCase()} - bulk write - results - ok: ${results.result.ok}, number inserted: ${results.insertedCount}`);
    })
    .catch(err => console.error(err));
});


// ***************** POST (UNUSED) *******************
// @route POST api/fixtures
// @desc  Create a fixture
// @access Public
// router.post('/', (req, res) => {
//     const newFixture = new Fixture({
//         setOfFixturesNumber: req.body.setOfFixturesNumber,
//         fixtureNumber: req.body.fixtureNumber,
//         dateOfFixture: req.body.dateOfFixture,
//         homeTeam: req.body.homeTeam,
//         awayTeam: req.body.awayTeam,
//         homeTeamsScore: req.body.homeTeamsScore,
//         awayTeamsScore: req.body.awayTeamsScore,
//         homeTeamsGoals: req.body.homeTeamsGoals,
//         awayTeamsGoals: req.body.awayTeamsGoals,
//         injuryTimeFirstHalf: req.body.injuryTimeFirstHalf,
//         injuryTimeSecondHalf: req.body.injuryTimeSecondHalf,
//         minutesPlayed: req.body.minutesPlayed,
//         hasFixtureFinished: req.body.hasFixtureFinished,
//     });

//     newFixture.save().then(fixture => res.json(fixture));
// });


// ***************** DELETE BY USER *******************
// @route DELETE api/fixtures/:id
// @desc  Delete a fixture
// @access Public
router.delete('/:userDocumentId', (req, res) => {
    Fixture.deleteMany({ userDocumentId: req.params.userDocumentId })
    // .then(fixture => fixture.remove().then(() => res.json({success: true})))
    .then(() => res.json({success: true}))
    .catch(err => res.status(404).json({success: false}))
});


// ***************** DELETE ALL (NOT USED) *******************
// @route DELETE api/fixtures
// @desc  Delete all fixtures
// @access Public
// router.delete('/', (req, res) => {
//     // Return success true or false as the http response
//     Fixture.deleteMany({}, err => err ? res.status(404).json({success: false}) : res.json({success: true}))
// });


module.exports = router;