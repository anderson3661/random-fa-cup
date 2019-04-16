const express = require('express');
const router = express.Router();

const MODEL_NAME = 'team';

const Team = require('../../models/Team');
const { getByUser, bulkUpdate, deleteManyByUser } = require('./api-helpers');


// ***************** GET *******************
// GET api/teams                                    Get all team documents
router.get('/:userDocumentId', (req, res) => { getByUser(Team, req, res); });


// ***************** PUT *******************
// PUT (or POST/PATCH) api/teams/                   Update team documents using bulkWrite
router.put('/', (req, res) => { bulkUpdate(MODEL_NAME, Team, req, res, 'PUT'); });


// ***************** POST *******************
// POST api/teams                                   Create team documents using bulkWrite
router.post('/', (req, res) => { bulkUpdate(MODEL_NAME, Team, req, res, 'POST'); });


// ************ DELETE BY USER **************
// DELETE api/teams/:id                              Delete all teams for user
router.delete('/:userDocumentId', (req, res) => { deleteManyByUser(Team, req, res); });


// ***************** POST (UNUSED) *******************
// router.post('/', (req, res) => {
//     const newTeam = new Team({ teamName: req.body.teamName, isATopTeam: req.body.isATopTeam });

//     newTeam.save()
//     .then(team => {
//         // console.log(res.json(team));
//         return res.json(team);
//     })
//     .catch(err => console.error(err));
// });


module.exports = router;