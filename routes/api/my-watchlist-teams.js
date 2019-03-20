const express = require('express');
const router = express.Router();

const MODEL_NAME = 'my-watchlist-team';

// MyWatchlistTeam Model
const MyWatchlistTeam = require('../../models/MyWatchlistTeam');


// ***************** GET *******************
// @route GET api/my-watchlist-teams
// @desc  Get all my-watchlist-team documents
// @access Public
router.get('/:userDocumentId', (req, res) => {
    MyWatchlistTeam.find({ userDocumentId: req.params.userDocumentId })
        .then(results => res.json(results))
});


// ***************** PUT *******************
// @route PUT (or POST/PATCH) api/teams/
// @desc  Update team documents using bulkWrite
// @access Public
router.put('/', (req, res) => {
    MyWatchlistTeam.bulkWrite(req.body)
        .then(results => {
            const response = res.json(results);
            console.log(`${MODEL_NAME.toUpperCase()} - bulk write - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
            console.log(`${MODEL_NAME.toUpperCase()} - bulk write - results - ok: ${results.result.ok}, number modified: ${results.modifiedCount}`);
        })
        // .catch(err => res.status(404).json({success: false}))
        .catch(err => console.error(err))
});


// ***************** POST *******************
// @route POST api/my-watchlist-teams
// @desc  Create my-watchlist-team documents using bulkWrite
// @access Public
router.post('/', (req, res) => {
    MyWatchlistTeam.bulkWrite(req.body)
    .then(results => {
        const response = res.json(results);
        console.log(`${MODEL_NAME.toUpperCase()} - bulk write - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
        console.log(`${MODEL_NAME.toUpperCase()} - bulk write - results - ok: ${results.result.ok}, number inserted: ${results.insertedCount}`);
    })
    .catch(err => console.error(err));
});


// ***************** DELETE BY USER *******************
// @route DELETE api/my-watchlist-teams
// @desc  Delete my-watchlist-team(s)
// @access Public
router.delete('/', (req, res) => {
    MyWatchlistTeam.bulkWrite(req.body)
    .then(results => {
        const response = res.json(results);
        console.log(`${MODEL_NAME.toUpperCase()} - bulk delete - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
        console.log(`${MODEL_NAME.toUpperCase()} - bulk delete - results - ok: ${results.result.ok}, number deleted: ${results.deletedCount}`);
    })
    .catch(err => console.error(err));
});


module.exports = router;