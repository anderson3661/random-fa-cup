const express = require('express');
const router = express.Router();

const MODEL_NAME = 'my-watchlist-team';

const MyWatchlistTeam = require('../../models/MyWatchlistTeam');
const { getByUser, bulkUpdate } = require('./api-helpers');


// ***************** GET *******************
// GET api/my-watchlist-teams                   Get all my-watchlist-team documents
router.get('/:userDocumentId', (req, res) => { getByUser(MyWatchlistTeam, req, res); });


// ***************** PUT *******************
// PUT (or POST/PATCH) api/teams/               Update team documents using bulkWrite
router.put('/', (req, res) => { bulkUpdate(MODEL_NAME, MyWatchlistTeam, req, res, 'PUT'); });


// ***************** POST *******************
// POST api/my-watchlist-teams                  Create my-watchlist-team documents using bulkWrite
router.post('/', (req, res) => { bulkUpdate(MODEL_NAME, MyWatchlistTeam, req, res, 'POST'); });


// ************ DELETE BY USER **************
// DELETE api/my-watchlist-teams                Delete my-watchlist-team(s)
router.delete('/', (req, res) => { bulkUpdate(MODEL_NAME, MyWatchlistTeam, req, res, 'DELETE'); });


module.exports = router;