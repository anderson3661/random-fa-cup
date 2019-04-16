const express = require('express');
const router = express.Router();

const MODEL_NAME = 'settingsFactors';

const SettingsFactors = require('../../models/SettingsFactors');
const { getByUser, findOneAndUpdateByUser, postSave, deleteOneByUser } = require('./api-helpers');


// ***************** GET *******************
// GET api/settings-factors                          Get all Settings Factors documents  (should only be 1 for each user)
router.get('/:userDocumentId', (req, res) => { getByUser(SettingsFactors, req, res); });


// ***************** PUT *******************
// PUT (or POST/PATCH) api/settings-factors/:id      Update the Settings Factors document
router.put('/:id', (req, res) => { findOneAndUpdateByUser(MODEL_NAME, SettingsFactors, req, res); });


// ***************** POST *******************
// POST api/settings-factors                         Create an Settings Factors document
router.post('/', (req, res) => {
    const newSettingsFactors = new SettingsFactors({
        userDocumentId: req.body.userDocumentId,
        season: req.body.season,
        competitionStartDate: req.body.competitionStartDate,
        goalFactors: req.body.goalFactors
    });
    postSave(MODEL_NAME, newSettingsFactors, res);
});


// ************ DELETE BY USER **************
// DELETE api/settings-factors/:id                    Delete an Settings Factor document
router.delete('/:userDocumentId', (req, res) => { deleteOneByUser(SettingsFactors, req, res); });
    

// ************* PUT (UNUSED) **************
// PUT (or POST/PATCH) api/settings-factors/:id      Update the Settings Factors document
// router.put('/:id', (req, res) => {
    // console.log('Starting');
    // console.log(req.params.id);
    // console.log(req.body);
    // console.log(req.body.teamName);
    // const updatedTeam = { teamName: req.body.teamName, isATopTeam: req.body.isATopTeam };

    // SettingsFactors.findOneAndUpdate({ _id: req.params.id}, req.body)
    // Team.findByIdAndUpdate(req.params.id, updatedTeam)
    // Team.findById(req.params.id)
        // .then(settingsFactors => settingsFactors.save())
        // .then(results => console.log(results))
        // .then(team => {
        //     console.log(res.json(team));
        //     return res.json(team)
        // })
        // .catch(err => res.status(404).json({success: false}))
        // .catch(err => console.error(err))
// });

    
module.exports = router;