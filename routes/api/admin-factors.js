const express = require('express');
const router = express.Router();

const MODEL_NAME = 'adminFactors';

//AdminFactors Model
const AdminFactors = require('../../models/AdminFactors');


// ***************** GET *******************
// @route GET api/admin-factors
// @desc  Get all Admin Factors documents  (should only be 1 for each user)
// @access Public
router.get('/:userDocumentId', (req, res) => {
    AdminFactors.find({ userDocumentId: req.params.userDocumentId })
        .then(results => res.json(results))
});


// ***************** GET (NOT USED) *******************
// @route GET api/admin-factors
// @desc  Get all Admin Factors documents  (should only be 1)
// @access Public
// router.get('/', (req, res) => {
//     AdminFactors.find()
//         // .sort({ date: -1 })
//         .then(adminFactors => res.json(adminFactors))
// });


// ***************** PUT *******************
// @route PUT (or POST/PATCH) api/admin-factors/:id
// @desc  Update the Admin Factors document
// @access Public
router.put('/:id', (req, res) => {

    AdminFactors.findOneAndUpdate({ _id: req.params.id}, req.body)
        .then(results => {
            const response = res.json(results);
            console.log(`${MODEL_NAME.toUpperCase()} - updated - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
        })
        .catch(err => console.error(err))
});


// ***************** PUT (UNUSED) *******************
// @route PUT (or POST/PATCH) api/admin-factors/:id
// @desc  Update the Admin Factors document
// @access Public
// router.put('/:id', (req, res) => {
    // console.log('Starting');
    // console.log(req.params.id);
    // console.log(req.body);
    // console.log(req.body.teamName);
    // const updatedTeam = { teamName: req.body.teamName, isATopTeam: req.body.isATopTeam };

    // AdminFactors.findOneAndUpdate({ _id: req.params.id}, req.body)
    // Team.findByIdAndUpdate(req.params.id, updatedTeam)
    // Team.findById(req.params.id)
        // .then(adminFactors => adminFactors.save())
        // .then(results => console.log(results))
        // .then(team => {
        //     console.log(res.json(team));
        //     return res.json(team)
        // })
        // .catch(err => res.status(404).json({success: false}))
        // .catch(err => console.error(err))
// });


// ***************** POST *******************
// @route POST api/admin-factors
// @desc  Create an Admin Factors document
// @access Public
router.post('/', (req, res) => {
    const newAdminFactors = new AdminFactors({
        userDocumentId: req.body.userDocumentId,
        season: req.body.season,
        competitionStartDate: req.body.competitionStartDate,
        goalFactors: req.body.goalFactors
    });

    newAdminFactors.save()
        .then(results => {
            const response = res.json(results);
            console.log(`${MODEL_NAME.toUpperCase()} - inserted - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
        })
        .catch(err => console.error(err))
});


// ***************** DELETE BY USER *******************
// @route DELETE api/admin-factors/:id
// @desc  Delete an Admin Factor document
// @access Public
router.delete('/:userDocumentId', (req, res) => {
    AdminFactors.findOneAndDelete({ userDocumentId: req.params.userDocumentId })
        // .then(adminFactor => adminFactor.remove().then(() => res.json({success: true})))        
        .then(() => res.json({success: true}))
        .catch(err => res.status(404).json({success: false}))
});
    
    
// ***************** DELETE ALL (NOT USED) *******************
// @route DELETE api/admin-factors
// @desc  Delete all Admin Factors documents
// @access Public
// router.delete('/', (req, res) => {
//     // Return success true or false as the http response
//     AdminFactors.deleteMany({}, err => err ? res.status(404).json({success: false}) : res.json({success: true}))
// });


module.exports = router;