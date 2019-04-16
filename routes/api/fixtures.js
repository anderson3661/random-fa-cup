const express = require('express');
const router = express.Router();

const MODEL_NAME = 'fixture';

const Fixture = require('../../models/Fixture');
const { getByUser, bulkUpdate, deleteManyByUser } = require('./api-helpers');


// **************** GET ******************
// GET api/fixtures                               Get all fixture documents
router.get('/:userDocumentId', (req, res) => { getByUser(Fixture, req, res); });


// **************** PUT ******************
// PUT (or POST/PATCH) api/fixtures               Update fixture documents using bulkWrite
router.put('/', (req, res) => { bulkUpdate(MODEL_NAME, Fixture, req, res, 'PUT'); });


// **************** POST ******************
// POST api/table                                   Create table documents using bulkWrite
router.post('/', (req, res) => { bulkUpdate(MODEL_NAME, Fixture, req, res, 'POST'); });


// ************ DELETE BY USER **************
// DELETE api/fixtures/:id                          Delete all fixtures for user
router.delete('/:userDocumentId', (req, res) => { deleteManyByUser(Fixture, req, res); });


// ************ PUT (UNUSED) **************
// router.put('/:id', (req, res) => {
//     console.log('Starting');
//     console.log(req.params.id);
//     console.log(req.body);

//     Fixture.findOneAndUpdate({ _id: req.params.id}, req.body)
//         // .then(fixture => fixture.save())
//         .then(fixture => console.log(fixture))
//         .catch(err => console.error(err))
// });


// ************ POST (UNUSED) **************
// POST api/fixtures                                Create a fixture
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


module.exports = router;