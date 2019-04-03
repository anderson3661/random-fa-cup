import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';

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
        if (this.props.user.authenticated) this.props.dispatch({ type: LOADING_APP, data: { loading: true }});
        this.state = {
            loadingError: false,
            dialogLoadingBackendErrorConfirmIsOpen: false,
        }
    }

    componentDidMount() {
        if (this.props.user.authenticated) this.props.dispatch(loadFromAllDbsStarted());
    }

    componentWillReceiveProps(nextProps, prevState) {
        if (nextProps.miscellaneous.loadingBackendError) this.setState({ loadingError: true });     // If an error was encountered on the backend, then open the backend error dialog
    }

    render() {
        const { loadingError } = this.state;
        // const { loading } = this.props.user;
        const { loading } = this.props.miscellaneous;
        return (
            <Router>
                <div className="outer-container">
                    {loading && !loadingError && <div className="loading-filler"></div>}             {/* Used on the initial load screen to put the footer at the bottom of the screen */}
                    {/* <Header authenticated={ this.props.user.authenticated } dispatch={ this.props.dispatch } /> */}
                    { loadingError ? <LoadingError /> : (loading ? <Loading /> : <Routes />) }
                    <Footer />
                </div>                   
            </Router>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return { 
        user: state.default.user,
        miscellaneous: state.default.miscellaneous,
    }
}


//Call this function to connect to Redux and get a handle to dispatch (used above) ... need to have mapStateToProps to update the loading state when data has been received async from the db
App = connect(mapStateToProps, null)(App)

export default App;