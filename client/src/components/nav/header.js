import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { LOGOUT_AND_RESET_STATE_TO_DEFAULTS } from '../../redux/actions/types';
import { INCLUDE_MONGODB_OPTION, FA_CUP_SMALL_IMAGE } from '../../utilities/constants';
import { refreshLatestFixtures } from '../../redux/actions/fixturesActions';
import * as helpers from '../../utilities/helper-functions/helpers';

import './header.scss';


class Header extends Component {

    state = {
        reRenderAfterReplays: false,                    // If replays have finished then fixtures for the next round will be played next.  In order to re-render this header component need to set state so that the option appears                                             
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

    logout = () => this.props.dispatch({ type: LOGOUT_AND_RESET_STATE_TO_DEFAULTS });
        
    openSlideMenu = () => { this.refs.sideMenu.style.width = '250px'; };
    closeSlideMenu = () => { this.refs.sideMenu.style.width = '0'; };

    componentWillReceiveProps(nextProps, prevState) {

        // If replays have finished then fixtures for the next round will be played next.  In order to re-render this header component need to set state so that the option appears
        if (nextProps.loadingRefreshHeaderAfterLatestFixtures && !this.props.loadingRefreshHeaderAfterLatestFixtures) {
            this.setState({ reRenderAfterReplays: true });
        }

        // If replays have finished then fixtures for the next round will be played next.  In order to re-render this header component need to set state so that the option appears
        // However, as this header component is always 'live' (apart from when accessing the Home component), need to reset reRenderAfterReplays, otherwise it will always be true once set
        if (this.state.reRenderAfterReplays && !nextProps.loadingRefreshHeaderAfterLatestFixtures && !this.props.loadingRefreshHeaderAfterLatestFixtures) {
            this.setState({ reRenderAfterReplays: false });
        }   
    }

    handleLatestFixtures = () => {
        // If replays have finished then fixtures for the next round will be played next.  Need to trigger a re-render of the Latest Fixtures component
        // so that the currently displayed replays are replaced by the fixtures for the next round
        if (this.props.isFixturesLatestNav) {
            this.props.dispatch(refreshLatestFixtures());
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
        const { reRenderAfterReplays, displayNavBackground } = this.state;

        return (
            <Fragment>
                <nav className={displayNavBackground ? 'displayNavBackground' : ''}>

                    <div className={"app-header " + (displayNavBackground ? 'displayNavBackground' : '')}>      {/* Can't use string literals otherwise code following is not accessible in debugger */}
                        <img className="fa-cup-image" src={FA_CUP_SMALL_IMAGE} alt=""></img>
                        <p><span>Random</span><span>FA Cup</span></p>
                    </div>

                    <div className="links">
                        { !isHomeNav && 
                            <NavLink exact to="/home" className="nav-link" activeClassName="active-link">
                                <div className="football home"><span>Home</span></div>
                            </NavLink>
                        }

                        { authenticated && !isHomeNav && !hasCompetitionFinished && !isDrawNav && okToProceedWithDraw &&
                            <NavLink exact to="/draw" className="nav-link" activeClassName="active-link">
                                <div className="football draw"><span>{competitionRoundForNextDrawLabel}</span></div>
                            </NavLink>
                        }

                        { !isHomeNav && (reRenderAfterReplays ? true : !isFixturesLatestNav) && !okToProceedWithDraw &&
                            <NavLink to="/fixtures-latest" className="nav-link" activeClassName="active-link">
                                <div className="football latest-fixtures" onClick={this.handleLatestFixtures} ><span>{competitionRoundForPlayLabel}</span></div>
                            </NavLink>
                        }

                        { !isHomeNav && !isFixturesAndResultsNav && hasCompetitionStarted &&
                            <NavLink to="/fixtures-and-results" className="nav-link" activeClassName="active-link">
                                <div className="football results"><span>Fixtures/ Results</span></div>
                            </NavLink>
                        }

                        { !isSettingsNav &&
                            <NavLink exact to="/settings" className="nav-link" activeClassName="active-link">
                                <div className={"football settings" + (isHomeNav ? '-isHomeNav': '')}><span>Settings</span></div>      {/* Can't use string literals otherwise code following is not accessible in debugger */}
                            </NavLink>
                        }
                    </div>

                    {INCLUDE_MONGODB_OPTION && 
                        <div className="login-section">
                            <div className="login-buttons">
                                <ul className="navbar-authentication">
                                    {!authenticated && <li><NavLink to="/login" className="nav-link" onClick={this.props.closeSlideMenu}>Log in</NavLink></li>}
                                    {!authenticated && <li><NavLink to="/sign-up" className="nav-link-button" onClick={this.props.closeSlideMenu}>Sign up</NavLink></li>}
                                    {authenticated && <li><NavLink to="/login" className="nav-link-button" onClick={this.logout}>Log out</NavLink></li>}
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
    const { hasCompetitionStarted, hasCompetitionFinished, competitionRoundForNextDraw, competitionRoundForPlay, okToProceedWithDraw, haveFixturesForCompetitionRoundBeenPlayed, haveFixturesProducedReplays, loadingRefreshHeaderAfterLatestFixtures } = state.default.miscellaneous;

    return {
        authenticated,
        hasCompetitionStarted,
        hasCompetitionFinished,
        competitionRoundForNextDraw,
        okToProceedWithDraw,
        competitionRoundForPlay: competitionRoundForPlay,
        competitionRoundForNextDrawLabel: helpers.getCompetitionRoundForNextDrawLabel(competitionRoundForNextDraw),
        competitionRoundForPlayLabel: helpers.getCompetitionRoundForPlayLabel(competitionRoundForPlay, haveFixturesForCompetitionRoundBeenPlayed, haveFixturesProducedReplays),
        isHomeNav: (ownProps.isHomeNav === undefined ? false : ownProps.isHomeNav),
        isDrawNav: (ownProps.isDrawNav === undefined ? false : ownProps.isDrawNav),
        isFixturesLatestNav: (ownProps.isFixturesLatestNav === undefined ? false : ownProps.isFixturesLatestNav),
        isFixturesAndResultsNav: (ownProps.isFixturesAndResultsNav === undefined ? false : ownProps.isFixturesAndResultsNav),
        isSettingsNav: (ownProps.isSettingsNav === undefined ? false : ownProps.isSettingsNav),
        loadingRefreshHeaderAfterLatestFixtures,
    }
}


export default connect(mapStateToProps, null)(Header);
