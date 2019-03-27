import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Header from '../nav/header';
import Home from '../home/home';
import FixturesAndResults from '../fixtures-and-results/fixtures-and-results';
import FixturesLatest from '../fixtures-latest/fixtures-latest';
import Draw from '../draw/draw';
import Settings from '../settings/settings';
import Help from '../help/help';
import Contact from '../contact/contact';
import About from '../about/about';
import Login from '../authentication/login';
import SignUp from '../authentication/sign-up';
import PasswordReset from '../authentication/password-reset';

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/home" render={ () => <Header isHomeNav={true}><Home /></Header> } />
            <Route exact path="/draw" render={ () => <Header isDrawNav={true}><Draw /></Header> } />
            <Route exact path="/fixtures-latest" render={ () => <Header isFixturesLatestNav={true}><FixturesLatest /></Header> } />
            <Route exact path="/fixtures-and-results" render={ () => <Header isFixturesAndResultsNav={true}><FixturesAndResults /></Header> } />
            <Route exact path="/settings" render={ () => <Header isSettingsNav={true}><Settings /></Header> } />
            <Route exact path="/help" render={ () => <Header><Help /></Header> } />
            <Route exact path="/contact" render={ () => <Header><Contact /></Header> } />
            <Route exact path="/about" render={ () => <Header><About /></Header> } />
            <Route exact path="/login" render={ (props) => <Header><Login {...props} /></Header> } />           {/* Need to pass props otherwise Sign Up doesn't have access to history to re-route to Settings */}
            <Route exact path="/sign-up" render={ (props) => <Header><SignUp {...props} /></Header> } />        {/* Need to pass props otherwise Sign Up doesn't have access to history to re-route to Settings */}
            <Route exact path="/password-reset" render={ () => <Header><PasswordReset /></Header> } />
            <Route path="*" render={ () => <Header isHomeNav={true}><Home /></Header> } />
            {/*
            <Route path="/home" component={Home} />
            <Route path="/teamstats/:teamName" render={ () => <TeamStats /> } />
            <Route exact path="/fixtures" render={ () => <Fixtures displayRemainingFixtures={true} /> } />
            <Route exact path="/fixtures/results" render={ () => <Fixtures displayResults={true} /> } />
            <Route exact path="/fixtures/:competitionRound" component={FixturesByRound} />
            <Route exact path="/results/:competitionRound" render={ (props) => <Fixtures displayResults={true} {...props} /> } />
            <Route path="/help" component={Help} />
            */}
        </Switch>
    );
};

export default Routes;