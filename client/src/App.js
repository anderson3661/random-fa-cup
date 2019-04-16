import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import Header from './components/nav/header';
import Footer from './components/nav/footer';
import Routes from './components/nav/routes';

import Loading from './components/loading/loading';
import LoadingError from './components/loading-error/loading-error';
import { loadFromAllDbsStarted } from './redux/actions/miscellaneousActions';
import { LOADING_APP } from './redux/actions/types';

import './App.scss';

class App extends Component {

    constructor(props) {
        super(props);

        props.startLoadingApp();

        this.state = {
            loadingError: false,
            dialogLoadingBackendErrorConfirmIsOpen: false,
        }
    }

    componentDidMount() {
        this.props.loadFromAllDbsStarted();
    }

    componentWillReceiveProps(nextProps, prevState) {
        if (nextProps.loadingBackendError) this.setState({ loadingError: true });     // If an error was encountered on the backend, then open the backend error dialog
    }

    render() {
        const { loadingError } = this.state;
        const { loadingApp } = this.props;
        return (
            <Router>
                <div className="outer-container">
                    {loadingApp && !loadingError && <div className="loading-filler"></div>}             {/* Used on the initial load screen to put the footer at the bottom of the screen */}
                    { loadingError ? <LoadingError /> : (loadingApp ? <Loading /> : <Routes />) }
                    <Footer />
                </div>                   
            </Router>
        );
    }
}

const mapStateToProps = (state) => {
    const { authenticated } = state.default.user;
    const { loadingApp, loadingBackendError } = state.default.miscellaneous;
    return { 
        authenticated,
        loadingApp, loadingBackendError,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        startLoadingApp: () => dispatch({ type: LOADING_APP, data: { loadingApp: true }}),
        loadFromAllDbsStarted: () => dispatch(loadFromAllDbsStarted()),
    }
}

App.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    loadingApp: PropTypes.bool.isRequired,
    loadingBackendError: PropTypes.bool.isRequired,
    startLoadingApp: PropTypes.func.isRequired,
    loadFromAllDbsStarted: PropTypes.func.isRequired,
}

//Call this function to connect to Redux and get a handle to dispatch (used above) ... need to have mapStateToProps to update the loadingApp state when data has been received async from the db
export default connect(mapStateToProps, mapDispatchToProps)(App);
