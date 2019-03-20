import React, { Component, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { RESET_STATE_TO_DEFAULTS } from '../../redux/actions/types';
import { INCLUDE_MONGODB_OPTION, FA_CUP_SMALL_IMAGE } from '../../utilities/constants';
import * as helpers from '../../utilities/helper-functions/helpers';

import './header.scss';


class Header extends Component {

    state = { displayNavBackground: false }

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

    logout = () => this.props.dispatch({ type: RESET_STATE_TO_DEFAULTS });
        
    openSlideMenu = () => { this.refs.sideMenu.style.width = '250px'; };
    closeSlideMenu = () => { this.refs.sideMenu.style.width = '0'; };

    shouldComponentUpdate(nextProps, nextState) {
        console.log(this.props);
        debugger;
        return (
            helpers.hasObjectValueChanged(this.state, nextState, 'displayNavBackground') ||
            helpers.hasObjectValueChanged(this.props, nextProps, 'hasCompetitionStarted') ||
            helpers.hasObjectValueChanged(this.props, nextProps, 'isHomeNav') ||
            helpers.hasObjectValueChanged(this.props, nextProps, 'isDrawNav') ||
            helpers.hasObjectValueChanged(this.props, nextProps, 'isFixturesLatestNav') ||
            helpers.hasObjectValueChanged(this.props, nextProps, 'isFixturesAndResultsNav') ||
            helpers.hasObjectValueChanged(this.props, nextProps, 'isSettingsNav') ||
            helpers.haveObjectValuesChanged(this.props, nextProps, 'nextCompetitionRoundForDraw') ||
            helpers.haveObjectValuesChanged(this.props, nextProps, 'competitionRoundForPlay')
        );
    }

    render () {
        const { hasCompetitionStarted, nextCompetitionRoundForDraw, competitionRoundForPlay, isHomeNav, isDrawNav, isFixturesLatestNav, isFixturesAndResultsNav, isSettingsNav } = this.props;
        const { displayNavBackground } = this.state;

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

                        { !isHomeNav && !isDrawNav && nextCompetitionRoundForDraw.okToProceedWithDraw &&
                            <NavLink exact to="/draw" className="nav-link" activeClassName="active-link">
                                <div className="football draw"><span>{helpers.getCompetitionRoundForDrawLabel(nextCompetitionRoundForDraw)}</span></div>
                            </NavLink>
                        }

                        { !isHomeNav && !isFixturesLatestNav && competitionRoundForPlay.okToProceedWithPlay &&
                            <NavLink to="/fixtures-latest" className="nav-link" activeClassName="active-link">
                                <div className="football latest-fixtures"><span>{helpers.getCompetitionRoundForPlayLabel(competitionRoundForPlay)}</span></div>
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
                                    {!this.props.authenticated && <li><NavLink to="/login" className="nav-link" onClick={this.props.closeSlideMenu}>Log in</NavLink></li>}
                                    {!this.props.authenticated && <li><NavLink to="/sign-up" className="nav-link-button" onClick={this.props.closeSlideMenu}>Sign up</NavLink></li>}
                                    {this.props.authenticated && <li><NavLink to="/login" className="nav-link-button" onClick={this.logout}>Log out</NavLink></li>}
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
    const { hasCompetitionStarted, hasCompetitionFinished } = state.default.miscellaneous;
    const { fixturesForCompetition } = state.default;

    return {
        hasCompetitionStarted,
        nextCompetitionRoundForDraw: helpers.getNextCompetitionRoundForDraw(fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished),
        competitionRoundForPlay: helpers.getCompetitionRoundForPlay(fixturesForCompetition, hasCompetitionStarted, hasCompetitionFinished),
        isHomeNav: (ownProps.isHomeNav === undefined ? false : ownProps.isHomeNav),
        isDrawNav: (ownProps.isDrawNav === undefined ? false : ownProps.isDrawNav),
        isFixturesLatestNav: (ownProps.isFixturesLatestNav === undefined ? false : ownProps.isFixturesLatestNav),
        isFixturesAndResultsNav: (ownProps.isFixturesAndResultsNav === undefined ? false : ownProps.isFixturesAndResultsNav),
        isSettingsNav: (ownProps.isSettingsNav === undefined ? false : ownProps.isSettingsNav),
    }
}


export default connect(mapStateToProps, null)(Header);
