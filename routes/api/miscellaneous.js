const express = require('express');
const router = express.Router();

const MODEL_NAME = 'miscellaneous';

const Miscellaneous = require('../../models/Miscellaneous');
const { getByUser, findOneAndUpdateByUser, postSave, deleteOneByUser } = require('./api-helpers');


// ***************** GET *******************
// GET api/miscellaneous                            Get all Miscellaneous documents (should only be 1)
router.get('/:userDocumentId', (req, res) => { getByUser(Miscellaneous, req, res); });


// ***************** PUT *******************
// PUT (or POST/PATCH) api/miscellaneous/:id        Update the Miscellaneous document
router.put('/:id', (req, res) => { findOneAndUpdateByUser(MODEL_NAME, Miscellaneous, req, res); });


// ***************** POST ******************
// POST api/miscellaneous                           Create a Miscellaneous document
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
    postSave(MODEL_NAME, newMiscellaneous, res);
});


// ************ DELETE BY USER **************
// DELETE api/miscellaneous/:id                     Delete an Miscellaneous document
router.delete('/:userDocumentId', (req, res) => { deleteOneByUser(Miscellaneous, req, res); });


// *********** GET (NOT USED) **************
// GET api/miscellaneous                            Get all Miscellaneous documents (should only be 1)
// router.get('/', (req, res) => { Miscellaneous.find().sort({ date: -1 }).then(miscellaneous => res.json(miscellaneous))});


module.exports = router;