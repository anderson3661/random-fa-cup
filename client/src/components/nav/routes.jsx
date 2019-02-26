import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from '../home/home';
import Fixtures from '../fixtures/fixtures';
import FixturesLatest from '../fixtures-latest/fixtures-latest';
import LeagueTable from '../league-table/league-table';
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
            <Route path="/home" component={Home} />
            <Route exact path="/fixtures-latest" render={ () => <FixturesLatest /> } />
            <Route exact path="/fixtures" render={ () => <Fixtures displayRemainingFixtures={true} /> } />
            <Route exact path="/fixtures/results" render={ () => <Fixtures displayResults={true} /> } />
            <Route exact path="/league-table" render={ () => <LeagueTable /> } />
            <Route exact path="/league-table/full" render={ () => <LeagueTable tableTypeFull={true} /> } />
            <Route exact path="/teamstats/:teamName" render={ () => <TeamStats /> } />
            <Route path="/administration" render={ () => <Administration /> } />
            <Route path="/help" component={Help} />
            <Route path="/contact" component={Contact} />
            <Route path="/about" component={About} />
            <Route path="/login" component={Login} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/password-reset" component={PasswordReset} />
            <Route path="*" component={Home} />
        </Switch>
    );
};

export default Routes;