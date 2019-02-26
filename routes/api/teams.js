const express = require('express');
const router = express.Router();

const MODEL_NAME = 'team';

//Team Model
const Team = require('../../models/Team');


// ***************** GET *******************
// @route GET api/teams
// @desc  Get all team documents
// @access Public
router.get('/:userDocumentId', (req, res) => {
    Team.find({ userDocumentId: req.params.userDocumentId })
        .then(results => res.json(results))
});


// ***************** GET (NOT USED) *******************
// @route GET api/teams
// @desc  Get all team documents
// @access Public
// router.get('/', (req, res) => {
//     Team.find()
//         // .sort({ date: -1 })
//         .then(teams => {
//             return res.json(teams)
//         })
// });


// ***************** PUT *******************
// @route PUT (or POST/PATCH) api/teams/
// @desc  Update team documents using bulkWrite
// @access Public
router.put('/', (req, res) => {
    Team.bulkWrite(req.body)
        .then(results => {
            const response = res.json(results);
            console.log(`${MODEL_NAME.toUpperCase()} - bulk write - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
            console.log(`${MODEL_NAME.toUpperCase()} - bulk write - results - ok: ${results.result.ok}, number modified: ${results.modifiedCount}`);
        })
        // .catch(err => res.status(404).json({success: false}))
        .catch(err => console.error(err))
});


// ***************** POST *******************
// @route POST api/teams
// @desc  Create team documents using bulkWrite
// @access Public
router.post('/', (req, res) => {
    Team.bulkWrite(req.body)
    .then(results => {
        const response = res.json(results);
        console.log(`${MODEL_NAME.toUpperCase()} - bulk write - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
        console.log(`${MODEL_NAME.toUpperCase()} - bulk write - results - ok: ${results.result.ok}, number inserted: ${results.insertedCount}`);
    })
    .catch(err => console.error(err));
});


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


// ***************** DELETE BY USER *******************
// @route DELETE api/teams/:id
// @desc  Delete a team
// @access Public
router.delete('/:userDocumentId', (req, res) => {
    Team.deleteMany({ userDocumentId: req.params.userDocumentId })
    // .then(team => team.remove().then(() => res.json({success: true})))        
    .then(() => res.json({success: true}))
    .catch(err => res.status(404).json({success: false}))
});


// ***************** DELETE ALL (NOT USED) *******************
// @route DELETE api/teams
// @desc  Delete all teams
// @access Public
// router.delete('/', (req, res) => {
//     // Return success true or false as the http response
//     Team.deleteMany({}, err => err ? res.status(404).json({success: false}) : res.json({success: true}))
// });


module.exports = router;