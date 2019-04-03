const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const users = require('./routes/api/users');
const miscellaneous = require('./routes/api/miscellaneous');
const settingsFactors = require('./routes/api/settings-factors');
const teams = require('./routes/api/teams');
const myWatchlistTeams = require('./routes/api/my-watchlist-teams');
const fixtures = require('./routes/api/fixtures');

const app = express();

//Bodyparser middleware
app.use(bodyParser.json());

//Db config
const db = process.env.MONGO_URI;                                    // CHANGE FOR PRODUCTION
// const db = require('./config/keys').mongoURI;                        // CHANGE FOR TESTING WITH MONGO_DB ON SERVER
// const db = require('./config/keys').mongoURILocal;                      // CHANGE FOR TESTING WITH MONGO_DB ON local

mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDb connected ...'))
    .catch(err => console.log(err));

//Use routes
app.use('/api/users', users);
app.use('/api/miscellaneous', miscellaneous);
app.use('/api/settings-factors', settingsFactors);
app.use('/api/teams', teams);
app.use('/api/my-watchlist-teams', myWatchlistTeams);
app.use('/api/fixtures', fixtures);

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