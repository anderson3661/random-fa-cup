const express = require('express');
const router = express.Router();

const MODEL_NAME = 'settingsFactors';

//SettingsFactors Model
const SettingsFactors = require('../../models/SettingsFactors');


// ***************** GET *******************
// @route GET api/settings-factors
// @desc  Get all Settings Factors documents  (should only be 1 for each user)
// @access Public
router.get('/:userDocumentId', (req, res) => {
    SettingsFactors.find({ userDocumentId: req.params.userDocumentId })
        .then(results => res.json(results))
});


// ***************** PUT *******************
// @route PUT (or POST/PATCH) api/settings-factors/:id
// @desc  Update the Settings Factors document
// @access Public
router.put('/:id', (req, res) => {

    SettingsFactors.findOneAndUpdate({ _id: req.params.id}, req.body)
        .then(results => {
            const response = res.json(results);
            console.log(`${MODEL_NAME.toUpperCase()} - updated - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
        })
        .catch(err => console.error(err))
});


// ***************** PUT (UNUSED) *******************
// @route PUT (or POST/PATCH) api/settings-factors/:id
// @desc  Update the Settings Factors document
// @access Public
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


// ***************** POST *******************
// @route POST api/settings-factors
// @desc  Create an Settings Factors document
// @access Public
router.post('/', (req, res) => {
    const newSettingsFactors = new SettingsFactors({
        userDocumentId: req.body.userDocumentId,
        season: req.body.season,
        competitionStartDate: req.body.competitionStartDate,
        goalFactors: req.body.goalFactors
    });

    newSettingsFactors.save()
        .then(results => {
            const response = res.json(results);
            console.log(`${MODEL_NAME.toUpperCase()} - inserted - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
        })
        .catch(err => console.error(err))
});


// ***************** DELETE BY USER *******************
// @route DELETE api/settings-factors/:id
// @desc  Delete an Settings Factor document
// @access Public
router.delete('/:userDocumentId', (req, res) => {
    SettingsFactors.findOneAndDelete({ userDocumentId: req.params.userDocumentId })
        // .then(settingsFactor => settingsFactor.remove().then(() => res.json({success: true})))        
        .then(() => res.json({success: true}))
        .catch(err => res.status(404).json({success: false}))
});
    
    
module.exports = router;