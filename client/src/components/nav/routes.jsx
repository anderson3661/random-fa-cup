import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { PATH_HOME, PATH_DRAW, PATH_FIXTURES_LATEST, PATH_FIXTURES_AND_RESULTS, PATH_SETTINGS, PATH_HELP, PATH_CONTACT, PATH_ABOUT,
         PATH_USER_SIGN_UP, PATH_USER_LOGIN, PATH_USER_RESET_PASSWORD, PATH_USER_CHANGE_PASSWORD } from '../../utilities/constants';

import Header from '../nav/header';
import Home from '../home/home';
import FixturesAndResults from '../fixtures-and-results/fixtures-and-results';
import FixturesLatest from '../fixtures-latest/fixtures-latest';
import Draw from '../draw/draw';
import Settings from '../settings/settings';
import Help from '../help/help';
import Contact from '../contact/contact';
import About from '../about/about';
import Authentication from '../authentication/authentication';

const Routes = () => {
    return (
        <Switch>
            <Route exact path={PATH_HOME} render={ () => <Header isHomeNav={true}><Home /></Header> } />
            <Route exact path={PATH_DRAW} render={ () => <Header isDrawNav={true}><Draw /></Header> } />
            <Route exact path={PATH_FIXTURES_LATEST} render={ () => <Header isFixturesLatestNav={true}><FixturesLatest /></Header> } />
            <Route path={PATH_FIXTURES_AND_RESULTS + "/:competitionRoundToTop"} render={ (props) => <Header isFixturesAndResultsNav={true}><FixturesAndResults {...props} /></Header> } />   {/* This is required by the links on the Home page */}
            <Route exact path={PATH_FIXTURES_AND_RESULTS} render={ () => <Header isFixturesAndResultsNav={true}><FixturesAndResults /></Header> } />
            <Route exact path={PATH_SETTINGS} render={ () => <Header isSettingsNav={true}><Settings /></Header> } />
            <Route exact path={PATH_HELP} render={ () => <Header><Help /></Header> } />
            <Route exact path={PATH_CONTACT} render={ () => <Header><Contact /></Header> } />
            <Route exact path={PATH_ABOUT} render={ () => <Header><About /></Header> } />
            <Route exact path={PATH_USER_SIGN_UP} render={ (props) => <Header><Authentication isSignUp={true} {...props} /></Header> } />               {/* Need to pass props otherwise Sign Up doesn't have access to history to re-route to Settings */}
            <Route exact path={PATH_USER_LOGIN} render={ (props) => <Header><Authentication isLogin={true} {...props} /></Header> } />                  {/* Need to pass props otherwise Sign Up doesn't have access to history to re-route to Home */}
            <Route exact path={PATH_USER_RESET_PASSWORD} render={ (props) => <Header><Authentication isResetPassword={true} {...props} /></Header> } />      {/* Need to pass props otherwise Sign Up doesn't have access to history to re-route to Home */}
            <Route exact path={PATH_USER_CHANGE_PASSWORD} render={ (props) => <Header><Authentication isChangePassword={true} {...props} /></Header> } />    {/* Need to pass props otherwise Sign Up doesn't have access to history to re-route to Home */}
            <Route path="*" render={ () => <Header isHomeNav={true}><Home /></Header> } />
        </Switch>
    );
};

export default Routes;