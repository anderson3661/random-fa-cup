getByUser = (model, req, res) => {
    model.find({ userDocumentId: req.params.userDocumentId })
    .then(results => res.json(results))
}


findOneAndUpdateByUser = (modelName, model, req, res) => {
    model.findOneAndUpdate({ _id: req.params.id}, req.body)
    .then(results => {
        const response = res.json(results);
        console.log(`${modelName.toUpperCase()} - updated - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
    })
    .catch(err => console.error(err))
}


postSave = (modelName, model, res) => {
    model.save()
    .then(results => {
        const response = res.json(results);
        console.log(`${modelName.toUpperCase()} - inserted - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
    })
    .catch(err => console.error(err))
}


bulkUpdate = (modelName, model, req, res, type) => {
    model.bulkWrite(req.body)
        .then(results => {
            const response = res.json(results);
            const typeText = (type === 'PUT' ? 'modified' : (type === 'POST' ? 'inserted' : (type === 'DELETE' ? 'deleted' : '???')));
            console.log(`${modelName.toUpperCase()} - bulk write - response - statusCode: ${response.statusCode}, statusMessage: ${response.statusMessage}`);
            console.log(`${modelName.toUpperCase()} - bulk write - results - ok: ${results.result.ok}, number {typeText}: ${results[typeText + 'Count']}`);
        })
        // .catch(err => res.status(404).json({success: false}))
        .catch(err => console.error(err))
}


deleteOneByUser = (model, req, res) => {
    model.findOneAndDelete({ userDocumentId: req.params.userDocumentId })
    // .then(doc => doc.remove().then(() => res.json({success: true})))        
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ success: false }))    
}


deleteManyByUser = (model, req, res) => {
    model.deleteMany({ userDocumentId: req.params.userDocumentId })
    // .then(doc => doc.remove().then(() => res.json({success: true})))        
    .then(() => res.json({ success: true }))
    .catch(err => res.status(404).json({ success: false }))    
}


isValidUser = (res, err, users, isSignup = false) => {
    if (err) {
        res.send({ success: false, message: 'Error: Server error' });
        return false;
    } else if (users.length === 0 && !isSignup) {
        res.send({ success: false, message: 'Error: A user with this email address does not exist' });
        return false;
    } else if (users.length === 1 && isSignup) {
        res.send({ success: false, message: 'Error: A user with this email address already exists' });
        return false;
    } else if (users.length > 1) {
        res.send({ success: false, message: 'Error: There are multiple users with this email address' });
        return false;
    }
    return true;
};


isValidReqBody = (res, emailAddress, password, oldPassword, isChangePassword = false) => {
    if (!emailAddress) {
        res.send({ success: false, message: 'Error: Email Address must be entered' });
        return false;
    }
    if (!oldPassword && isChangePassword) {
        res.send({ success: false, message: 'Error: Old Password must be entered' });
        return false;
    }
    if (!password) {
        res.send({ success: false, message: 'Error: Password must be entered' });
        return false;
    }
    return true;
}


module.exports = { getByUser, findOneAndUpdateByUser, postSave, bulkUpdate, deleteOneByUser, deleteManyByUser, isValidUser, isValidReqBody };