const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const users = require('./routes/api/users');
const miscellaneous = require('./routes/api/miscellaneous');
const adminFactors = require('./routes/api/admin-factors');
const teams = require('./routes/api/teams');
const fixtures = require('./routes/api/fixtures');
const leagueTable = require('./routes/api/league-table');

const app = express();

//Bodyparser middleware
app.use(bodyParser.json());

//Db config
// const db = require('./config/keys').mongoURI;
const db = require('./config/keys').mongoURILocal;

mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDb connected ...'))
    .catch(err => console.log(err));

//Use routes
app.use('/api/users', users);
app.use('/api/miscellaneous', miscellaneous);
app.use('/api/admin-factors', adminFactors);
app.use('/api/teams', teams);
app.use('/api/fixtures', fixtures);
app.use('/api/league-table', leagueTable);

//Serve static assets if in production
if(process.env.NODE_ENV === 'production') {
    //Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));