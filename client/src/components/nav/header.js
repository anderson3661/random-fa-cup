import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { INCLUDE_MONGODB_OPTION, FA_CUP_SMALL_IMAGE, PATH_HOME, PATH_DRAW, PATH_FIXTURES_LATEST, PATH_FIXTURES_AND_RESULTS, PATH_SETTINGS,
         PATH_USER_SIGN_UP, PATH_USER_LOGIN } from '../../utilities/constants';
import { refreshLatestFixtures } from '../../redux/actions/fixturesActions';
import { userLogout } from '../../redux/actions/userActions';
import * as helpers from '../../utilities/helper-functions/helpers';

import './header.scss';


class Header extends Component {

    state = {
        reRenderAfterReplays: false,                    // If replays have finished then fixtures for the next round will be played next.  In order to re-render this header component need to set state so that the option appears
        reRenderAfterSemiFinals: false,                 // If semi finals have finished then the final will be played next.  In order to re-render this header component need to set state so that the option appears
        displayNavBackground: false,
    }

    handleScroll = this.handleScroll.bind(this);

    componentDidMount() { window.addEventListener('scroll', this.handleScroll); }
    componentWillUnmount() { window.removeEventListener('scroll', this.handleScroll); }

    handleScroll(e) {
        if (window.pageYOffset > 50 & !this.state.displayNavBackground) {
            this.setState({displayNavBackground: true});
        } else if (window.pageYOffset <= 50 & this.state.displayNavBackground) {
            this.setState({displayNavBackground: false});
        }
    }

    logout = () => this.props.userLogout();
        
    openSlideMenu = () => { this.refs.sideMenu.style.width = '250px'; };
    closeSlideMenu = () => { this.refs.sideMenu.style.width = '0'; };

    componentWillReceiveProps(nextProps, prevState) {
        debugger;

        // If replays have finished then fixtures for the next round will be played next.  In order to re-render this header component need to set state so that the option appears
        if (nextProps.loadingRefreshHeaderAfterReplays && !this.props.loadingRefreshHeaderAfterReplays) {
            this.setState({ reRenderAfterReplays: true });
        }

        // If semi finals have finished then the final will be played next.  In order to re-render this header component need to set state so that the option appears
        if (nextProps.loadingRefreshHeaderAfterSemiFinals && !this.props.loadingRefreshHeaderAfterSemiFinals) {
            this.setState({ reRenderAfterSemiFinals: true });
        }

        // If replays have finished then fixtures for the next round will be played next.  In order to re-render this header component need to set state so that the option appears
        // However, as this header component is always 'live' (apart from when accessing the Home component), need to reset reRenderAfterReplays, otherwise it will always be true once set
        if (this.state.reRenderAfterReplays && !nextProps.loadingRefreshHeaderAfterReplays && !this.props.loadingRefreshHeaderAfterReplays) {
            this.setState({ reRenderAfterReplays: false });
        }

        // If semi finals have finished then the final will be played next.  In order to re-render this header component need to set state so that the option appears
        // However, as this header component is always 'live' (apart from when accessing the Home component), need to reset reRenderAfterReplays, otherwise it will always be true once set
        if (this.state.reRenderAfterSemiFinals && !nextProps.loadingRefreshHeaderAfterSemiFinals && !this.props.loadingRefreshHeaderAfterSemiFinals) {
            this.setState({ reRenderAfterSemiFinals: false });
        }
    }

    handleLatestFixtures = () => {
        // If replays have finished then fixtures for the next round will be played next.  Need to trigger a re-render of the Latest Fixtures component
        // so that the currently displayed replays are replaced by the fixtures for the next round
        if (this.props.isFixturesLatestNav) {
            this.props.refreshLatestFixtures();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        // Have commented this out for now, as links such as Help, Contact, About, Log In etc don't work - therefore probably easier to just let the component render
        // console.log(this.props);
        // debugger;
        // return (
        //     helpers.hasObjectValueChanged(this.state, nextState, 'displayNavBackground') ||
        //     helpers.hasObjectValueChanged(this.props, nextProps, 'hasCompetitionStarted') ||
        //     helpers.hasObjectValueChanged(this.props, nextProps, 'okToProceedWithDraw') ||
        //     helpers.haveObjectValuesChanged(this.props, nextProps, 'competitionRoundForNextDrawLabel') ||
        //     helpers.haveObjectValuesChanged(this.props, nextProps, 'competitionRoundForPlayLabel') ||
        //     helpers.hasObjectValueChanged(this.props, nextProps, 'isHomeNav') ||
        //     helpers.hasObjectValueChanged(this.props, nextProps, 'isDrawNav') ||
        //     helpers.hasObjectValueChanged(this.props, nextProps, 'isFixturesLatestNav') ||
        //     helpers.hasObjectValueChanged(this.props, nextProps, 'isFixturesAndResultsNav') ||
        //     helpers.hasObjectValueChanged(this.props, nextProps, 'isSettingsNav')
        // );
        return true;
    }

    render () {
        const { authenticated, hasCompetitionStarted, hasCompetitionFinished, okToProceedWithDraw, competitionRoundForNextDrawLabel, competitionRoundForPlayLabel,
                isHomeNav, isDrawNav, isFixturesLatestNav, isFixturesAndResultsNav, isSettingsNav } = this.props;
        const { reRenderAfterReplays, reRenderAfterSemiFinals, displayNavBackground } = this.state;
        debugger;

        return (
            <Fragment>
                <nav className={displayNavBackground ? 'displayNavBackground' : ''}>

                    <div className={"app-header " + (displayNavBackground ? 'displayNavBackground' : '')}>      {/* Can't use string literals otherwise code following is not accessible in debugger */}
                        <img className="fa-cup-image" src={FA_CUP_SMALL_IMAGE} alt=""></img>
                        <p><span>Random</span><span>FA Cup</span></p>
                    </div>

                    <div className="links">
                        { !isHomeNav && 
                            <NavLink exact to={PATH_HOME} className="nav-link" activeClassName="active-link">
                                <div className="nav-link-inner home"><span>Home</span></div>
                            </NavLink>
                        }

                        { authenticated && !isHomeNav && !hasCompetitionFinished && !isDrawNav && okToProceedWithDraw &&
                            <NavLink exact to={PATH_DRAW} className="nav-link" activeClassName="active-link">
                                <div className="nav-link-inner draw"><span>{competitionRoundForNextDrawLabel}</span></div>
                            </NavLink>
                        }

                        { !isHomeNav && (reRenderAfterReplays || reRenderAfterSemiFinals ? true : !isFixturesLatestNav) && !okToProceedWithDraw &&
                            <NavLink to={PATH_FIXTURES_LATEST} className="nav-link" activeClassName="active-link">
                                <div className="nav-link-inner latest-fixtures" onClick={this.handleLatestFixtures} ><span>{competitionRoundForPlayLabel}</span></div>
                            </NavLink>
                        }

                        { !isHomeNav && !isFixturesAndResultsNav && hasCompetitionStarted &&
                            <NavLink to={PATH_FIXTURES_AND_RESULTS} className="nav-link" activeClassName="active-link">
                                <div className="nav-link-inner results"><span>Fixtures/ Results</span></div>
                            </NavLink>
                        }

                        { !isSettingsNav &&
                            <NavLink exact to={PATH_SETTINGS} className="nav-link" activeClassName="active-link">
                                <div className={"nav-link-inner settings" + (isHomeNav ? '-isHomeNav': '')}><span>Settings</span></div>      {/* Can't use string literals otherwise code following is not accessible in debugger */}
                            </NavLink>
                        }
                    </div>

                    {INCLUDE_MONGODB_OPTION && 
                        <div className="login-section">
                            <div className="login-buttons">
                                <ul className="navbar-authentication">
                                    {!authenticated && <li><NavLink to={PATH_USER_LOGIN} className="nav-link-button" onClick={this.props.closeSlideMenu}>Log in</NavLink></li>}
                                    {!authenticated && <li><NavLink to={PATH_USER_SIGN_UP} className="nav-link-button" onClick={this.props.closeSlideMenu}>Sign up</NavLink></li>}
                                    {authenticated && <li><NavLink to={PATH_USER_LOGIN} className="nav-link-button" onClick={this.logout}>Log out</NavLink></li>}
                                </ul>
                            </div>
                        </div>
                    }

                </nav>

                {this.props.children}

            </Fragment>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    const { authenticated } = state.default.user;
    const { hasCompetitionStarted, hasCompetitionFinished, competitionRoundForNextDraw, competitionRoundForPlay, okToProceedWithDraw, haveFixturesForCompetitionRoundBeenPlayed,
            haveFixturesProducedReplays, loadingRefreshHeaderAfterReplays, loadingRefreshHeaderAfterSemiFinals } = state.default.miscellaneous;

    return {
        authenticated,
        hasCompetitionStarted, hasCompetitionFinished, competitionRoundForNextDraw, competitionRoundForPlay, okToProceedWithDraw,
        competitionRoundForNextDrawLabel: helpers.getCompetitionRoundForNextDrawLabel(competitionRoundForNextDraw),
        competitionRoundForPlayLabel: helpers.getCompetitionRoundForPlayLabel(competitionRoundForPlay, haveFixturesForCompetitionRoundBeenPlayed, haveFixturesProducedReplays),
        isHomeNav: ownProps.isHomeNav,
        isDrawNav: ownProps.isDrawNav,
        isFixturesLatestNav: ownProps.isFixturesLatestNav,
        isFixturesAndResultsNav: ownProps.isFixturesAndResultsNav,
        isSettingsNav: ownProps.isSettingsNav,
        loadingRefreshHeaderAfterReplays,
        loadingRefreshHeaderAfterSemiFinals,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        userLogout: () => dispatch(userLogout()),
        refreshLatestFixtures: () => dispatch(refreshLatestFixtures()),
    }
}


Header.defaultProps = {
    isHomeNav: false,
    isDrawNav: false,
    isFixturesLatestNav: false,
    isFixturesAndResultsNav: false,
    isSettingsNav: false,
}

Header.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    hasCompetitionStarted: PropTypes.bool.isRequired,
    hasCompetitionFinished: PropTypes.bool.isRequired,
    competitionRoundForNextDraw: PropTypes.string.isRequired,
    competitionRoundForPlay: PropTypes.string.isRequired,
    okToProceedWithDraw: PropTypes.bool.isRequired,
    competitionRoundForNextDrawLabel: PropTypes.string.isRequired,
    competitionRoundForPlayLabel: PropTypes.string.isRequired,
    isHomeNav: PropTypes.bool.isRequired,
    isDrawNav: PropTypes.bool.isRequired,
    isFixturesLatestNav: PropTypes.bool.isRequired,
    isFixturesAndResultsNav: PropTypes.bool.isRequired,
    isSettingsNav: PropTypes.bool.isRequired,
    loadingRefreshHeaderAfterReplays: PropTypes.bool.isRequired,
    loadingRefreshHeaderAfterSemiFinals: PropTypes.bool.isRequired,
    userLogout: PropTypes.func.isRequired,
    refreshLatestFixtures: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
