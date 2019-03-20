import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from '../nav/header';
import Home from '../home/home';
import FixturesAndResults from '../fixtures-and-results/fixtures-and-results';
import FixturesLatest from '../fixtures-latest/fixtures-latest';
import Draw from '../draw/draw';
import TeamStats from '../team-stats/team-stats';
import Administration from '../administration/administration';
import Help from '../help/help';
import Contact from '../contact/contact';
import About from '../about/about';
import Login from '../authentication/login';
import SignUp from '../authentication/sign-up';
import PasswordReset from '../authentication/password-reset';

const Routes = () => {
    return (
        <Switch>
            {/* <Route path="/home" component={Home} /> */}
            <Route exact path="/home" render={ () => <Header isHomeNav={true}><Home /></Header> } />
            <Route exact path="/draw" render={ () => <Header isDrawNav={true}><Draw /></Header> } />
            <Route exact path="/fixtures-latest" render={ () => <Header isFixturesLatestNav={true}><FixturesLatest /></Header> } />
            <Route exact path="/fixtures-and-results" render={ () => <Header isFixturesAndResultsNav={true}><FixturesAndResults /></Header> } />
            <Route exact path="/settings" render={ () => <Header isSettingsNav={true}><Administration /></Header> } />
            <Route path="/teamstats/:teamName" render={ () => <TeamStats /> } />
            <Route exact path="/help" render={ () => <Header><Help /></Header> } />
            <Route exact path="/contact" render={ () => <Header><Contact /></Header> } />
            <Route exact path="/about" render={ () => <Header><About /></Header> } />
            <Route exact path="/login" render={ () => <Header><Login /></Header> } />
            <Route exact path="/sign-up" render={ () => <Header><SignUp /></Header> } />
            <Route exact path="/password-reset" render={ () => <Header><PasswordReset /></Header> } />
            <Route path="*" render={ () => <Header isHomeNav={true}><Home /></Header> } />
            {/*
            <Route exact path="/fixtures" render={ () => <Fixtures displayRemainingFixtures={true} /> } />
            <Route exact path="/fixtures/results" render={ () => <Fixtures displayResults={true} /> } />
            <Route exact path="/draw" component={Draw} />
            <Route exact path="/fixtures/:competitionRound" component={FixturesByRound} />
            <Route exact path="/results/:competitionRound" render={ (props) => <Fixtures displayResults={true} {...props} /> } />
            <Route path="/administration" render={ () => <Administration /> } />
            <Route path="/help" component={Help} />
            <Route path="/contact" component={Contact} />
            <Route path="/about" component={About} />
            <Route path="/login" component={Login} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/password-reset" component={PasswordReset} />
            */}
        </Switch>
    );
};

export default Routes;