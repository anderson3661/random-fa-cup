import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import PropTypes from 'prop-types';

import { MAIN_BACKGROUND_IMAGE, GOALS_PER_MINUTE_FACTOR, DIVISIONS, RESET_APP_KEEP_CURRENT_SETTINGS, RESET_APP_USE_SYSTEM_DEFAULTS } from '../../utilities/constants';
import * as helpers from '../../utilities/helper-functions/helpers';
import CompetitionFinishedOrWrongStage from '../common/competition-finished-or-wrong-stage';
import SettingsHeader from './settings-header';
import SettingsFactors from './settings-factors';
import SettingsTeams from './settings-teams';
import SettingsMyWatchlistTeams from './settings-my-watchlist-teams';
import Loading from '../loading/loading';

import { getSettingsFactors, areThereSettingsFactorsValidationErrors, areThereTeamsValidationErrors, areThereAnyChangesToTeamValues, areThereAnyChangesToMyWatchlistTeamValues,
         areThereAnyChangesToSettingsFactorsValues, getUpdatesToTeamsToSendToDb, getNewMyWatchlistTeamsToSendToDb,
         getUpdatesToMyWatchlistTeamsToSendToDb, getDeletedMyWatchlistTeamsToSendToDb, getUpdatesToSettingsFactorsToSendToDb, getUpdatesToGoalFactorsToSendToDb,
         getNewTeamsArray, getNewMyWatchlistTeamsArray, deleteTeamFromMyWatchlistTeamsArray, validateSettingsFactors, validateTeams,
         getTeamsValidationError, blankTeamsValidationError } from './settings-helpers';

import { settingsSaveChanges, settingsResetApp, settingsResetAppKeepCurrentSettings } from '../../redux/actions/settingsActions';

import ConfirmationDialog from '../dialogs/confirmationDialog';
import ConfirmationResetApp from '../dialogs/confirmResetApp';


import "./settings.scss";

const LOCAL_STATE = {
    dataStorage: 'browser',
    dialogSaveChangesIsActive: false,
    dialogSaveChangesIsOpen: false,
    dialogResetAppIsActive: false,
    dialogResetAppChoiceIsOpen: false,
    dialogResetAppYesSelected: false,
    dialogResetAppConfirmIsOpen: false,
    dialogAddWatchlistTeamsPromptIsOpen: false,
    dialogLoadingBackendErrorConfirmIsOpen: false,
    haveChangesBeenMade: false,
}

class Settings extends Component {

    input;
    data;
    teamsForCompetitionSelectOptions;

    constructor(props) {
        super(props);

        this.state = Object.assign({},
                        LOCAL_STATE,
                        getSettingsFactors(props.settingsFactors, true, false, 'string'),
                        { teams: props.teamsForCompetition },
                        { settingsFactorsValidationErrors: this.createSettingsFactorsValidationErrorsArray(props)},
                        { teamsValidationErrors: this.createTeamValidationErrorsArray(props)},
                        { myWatchlistTeams: props.myWatchlistTeams },
                    );

        this.updateOriginalValues('props', props.settingsFactors);

        // Create the list of Select Option used in the My Watchlist Teams dropdown
        // Can't use Material UI's MenuItem because options flash after opening
        // const teamsForCompetitionFlattenedMapped = teamsForCompetitionFlattened.map(team => (<MenuItem key={team.teamName} value={team.teamName}>{team.teamName}</MenuItem>));
        this.teamsForCompetitionSelectOptions = [];
        this.teamsForCompetitionSelectOptions.push(<option key="ZZZ" value=""></option>);          // Add an empty option (will be at the start of the list of options)
        const teamsForCompetitionFlattened = helpers.getTeamsForCompetitionFlattened(props.teamsForCompetition);
        teamsForCompetitionFlattened.forEach(team => this.teamsForCompetitionSelectOptions.push(<option key={team.teamName} value={team.teamName}>{team.teamName}</option>));
    }

    createSettingsFactorsValidationErrorsArray = (props) => {
        let settingsFactorsValidationErrors = {};
        const settingsFactorsObject = getSettingsFactors(props.settingsFactors, true, false, 'string');
        Object.entries(settingsFactorsObject).forEach(([key, val]) => {
            settingsFactorsValidationErrors = Object.assign({}, settingsFactorsValidationErrors, { [key]: '' });
        });
        return settingsFactorsValidationErrors;
    }

    createTeamValidationErrorsArray = (props) => {
        return props.teamsForCompetition.map((division, i) => {
            return { [Object.keys(division)[0]]: division[DIVISIONS[i]].map(team => {
                return {teamName: team.teamName, errors: ''}
            })};
        });
    }

    updateOriginalValues = (sourceType, sourceArray) => {
        // These are used to see whether any values have changed so that a warning can be issued if the user trys to navigate away from the page
        this.originalValuesSettingsFactors = Object.assign({}, getSettingsFactors(sourceArray, sourceType === 'props', false, 'string'));
        // this.originalValuesTeams = this.state.teams.map(a => ({...a}));         // Deep clone of object
        this.originalValuesTeams = helpers.deepClone(this.state.teams);
        this.originalValuesMyWatchlistTeams = helpers.deepClone(this.state.myWatchlistTeams);
    }

    componentWillReceiveProps(nextProps, prevState) {
        // The following is required in order to display the correct dialog message (i.e. it has either worked, or there has been a backend error)
        // console.log('nextProps loading', nextProps.loading);
        // console.log('nextProps error loading', nextProps.loadingBackendError);
        // console.log('this.props loading', this.props.loading);

        if (nextProps.loading && !this.props.loading) {
            if (this.state.dialogResetAppChoiceIsOpen) this.setState({ dialogResetAppChoiceIsOpen: false });         // Reset App is in progress so set the flag which will close the dialog, and the loading indicator will then display
        }
        
        if (!nextProps.loading && this.props.loading) {
            this.checkForBackEndChanges(nextProps, 'dialogSaveChangesIsActive', 'dialogSaveChangesIsOpen');
            this.checkForBackEndChanges(nextProps, 'dialogResetAppIsActive', 'dialogResetAppConfirmIsOpen');
        }
        
        if (nextProps.signingUpUser && !this.props.signingUpUser) {
            //  After a user has signed up and everything has loaded, open the dialog to advise the user to add 'My Watchlist Teams'
            debugger;
            this.setState({ dialogAddWatchlistTeamsPromptIsOpen: true });
        }

        let nextPropsSettingsFactors = getSettingsFactors(nextProps.settingsFactors, true, true, 'string');      // Flatten the array to make it easier to compare
        let thisPropsSettingsFactors = getSettingsFactors(this.props.settingsFactors, true, true, 'string');      // Flatten the array to make it easier to compare

        this.setStateOnChangeSettingsFactors(nextPropsSettingsFactors, thisPropsSettingsFactors);

        this.setStateOnChangeTeams(nextProps);

        this.setStateOnChangeMyWatchlistTeams(nextProps);
    }

    checkForBackEndChanges = (nextProps, localStateActionIsActive, localStateFieldToUpdate) => {
        // If the new value of loading is false and the old value is true then the appropriate update (i.e. to Save Changes or Reset App) has completed.
        // If that has returned an error then display the error dialog, otherwise display the appropriate dialog to say that the process has completed.
        let saveChangesIsActive = (localStateActionIsActive === 'dialogSaveChangesIsActive');
        let resetAppIsActive = (localStateActionIsActive === 'dialogResetAppIsActive');

        if (nextProps.loadingBackendError) {
            this.setState({ dialogLoadingBackendErrorConfirmIsOpen: true });     // If an error was encountered on the backend, then open the backend error dialog
        } else {
            if (this.state[localStateActionIsActive]) {
                // if (resetAppIsActive) this.setState({ dialogResetAppChoiceIsOpen: false });            // Reset App has finished so set the flag which will close the dialog
                this.setState({ [localStateFieldToUpdate]: true });
                if (saveChangesIsActive || resetAppIsActive) {
                    this.setState({ haveChangesBeenMade: false });          // Set the flag which tracks whether any changes has been made back to false
                    this.updateOriginalValues('state', this.state);         // Update the original values which are compared to the current values to see whether any changes have been made
                }
            }
        }
    }

    setStateOnChangeSettingsFactors = (obj, objPrevious, nestedObject = '') => {
        // If any of the SettingsFactors values have changed then update local state
        let haveChangesBeenMade = false;
        Object.entries(obj).forEach(([key, val]) => {
            if (val && typeof val === 'object') {
                this.setStateOnChangeSettingsFactors(val, objPrevious, key);  // recurse.
            } else {
                let valPrevious = (nestedObject !== '' ? objPrevious[nestedObject][key] : objPrevious[key]);
                if (val !== valPrevious) {
                    this.setState({[key]: val});
                    haveChangesBeenMade = true;
                }
            }
        });
        if (haveChangesBeenMade) this.setState({ haveChangesBeenMade: true });
    };

    setStateOnChangeTeams = (nextProps) => {
        // If data has been loaded from the Teams database (i.e. _id is present) then update state, or if any of the values have changed then update state
        if ((nextProps.teamsForCompetition[0]._id && !this.state.teams[0]._id) || areThereAnyChangesToTeamValues(nextProps.teamsForCompetition, this.state.teams)) {
            this.setState({ teams: nextProps.teamsForCompetition });
        }
    }

    setStateOnChangeMyWatchlistTeams = (nextProps) => {
        // If data has been loaded from the MyWatchlistTeams database (i.e. _id is present) then update state, or if any of the values have changed then update state
        if ((nextProps.myWatchlistTeams.length > 0 && nextProps.myWatchlistTeams[0]._id && (this.state.myWatchlistTeams.length > 0 && !this.state.myWatchlistTeams[0]._id)) ||
            areThereAnyChangesToMyWatchlistTeamValues(nextProps.myWatchlistTeams, this.state.myWatchlistTeams)) {
            this.setState({ myWatchlistTeams: nextProps.myWatchlistTeams });
        }
    }

    handleChangeSettingsFactorsFields = (objectKey) => (updatedValue) => {
        // handleChangeSettingsFactorsFields = (field) => (e) => {
        this.setState({ [objectKey]: updatedValue.trim() }, this.updateHaveChangesBeenMadeAfterUserEdit);
        const validationErrors = helpers.deepClone(this.state.settingsFactorsValidationErrors);
        if (validationErrors[objectKey] !== '') this.setState({ settingsFactorsValidationErrors: Object.assign({}, validationErrors, { [objectKey]: '' }) });        
    }

    handleTeamsInputChange = (divisionIndex, teamIndex, updatedValue) => {
        this.setState(prevState => ({ teams: getNewTeamsArray(prevState.teams, divisionIndex, teamIndex, "teamName", updatedValue.trim()) }), this.updateHaveChangesBeenMadeAfterUserEdit);
        const validationErrors = helpers.deepClone(this.state.teamsValidationErrors);
        if (getTeamsValidationError(validationErrors, divisionIndex, teamIndex) !== '') this.setState({ teamsValidationErrors: blankTeamsValidationError(validationErrors, divisionIndex, teamIndex) });        
    }
    
    handleTopTeamsInputChange = (divisionIndex, teamIndex, updatedValue) => {
        // updatedValue returns the event as it has bubbled up from the Material UI checkbox
        // const isChecked = updatedValue.target.checked;            // Can't put updatedValue.target.checked directly into the setState statement otherwise it errors
        this.setState(prevState => ({ teams: getNewTeamsArray(prevState.teams, divisionIndex, teamIndex, "isATopTeam", updatedValue) }), this.updateHaveChangesBeenMadeAfterUserEdit);
    }
    
    handleMyWatchlistTeamsAddTeam = () => {
        this.setState(prevState => ({ myWatchlistTeams: prevState.myWatchlistTeams.concat({ teamName: '' }) }), this.updateHaveChangesBeenMadeAfterUserEdit);
    }

    handleMyWatchlistTeamsChangeTeam = (teamIndex, updatedValue) => {
        this.setState(prevState => ({ myWatchlistTeams: getNewMyWatchlistTeamsArray(prevState.myWatchlistTeams, teamIndex, updatedValue) }), this.updateHaveChangesBeenMadeAfterUserEdit);
    }

    handleMyWatchlistTeamsDeleteTeam = (teamIndex) => {
        this.setState(prevState => ({ myWatchlistTeams: deleteTeamFromMyWatchlistTeamsArray(prevState.myWatchlistTeams, teamIndex) }), this.updateHaveChangesBeenMadeAfterUserEdit);
    }

    updateHaveChangesBeenMadeAfterUserEdit = () => {
        // This is called whenever the user makes a change to the teams or any of the settings factors
        if (areThereAnyChangesToTeamValues( this.originalValuesTeams, this.state.teams) ||
            areThereAnyChangesToMyWatchlistTeamValues(this.originalValuesMyWatchlistTeams, this.state.myWatchlistTeams) ||
            areThereAnyChangesToSettingsFactorsValues(this.originalValuesSettingsFactors, getSettingsFactors(this.state, false, false, 'string'))) {
                this.setState({ haveChangesBeenMade: true });
        }
    }

    handleSaveChanges = (e) => {
        let settingsFactors;
        let updatedTeams;
        let newMyWatchlistTeams;
        let updatedMyWatchlistTeams;
        let deletedMyWatchlistTeams;
        let updatedSettingsFactors;
        let updatedGoalFactors;

        e.preventDefault();

        const settingsFactorsValidationErrors = validateSettingsFactors(this.state);
        const isSettingsFactorsValidationErrors = areThereSettingsFactorsValidationErrors(settingsFactorsValidationErrors);
        if (isSettingsFactorsValidationErrors) {
            this.setState({ settingsFactorsValidationErrors: settingsFactorsValidationErrors });
        }
        
        const teamsValidationErrors = validateTeams(this.state);
        const isTeamsValidationErrors = areThereTeamsValidationErrors(teamsValidationErrors);
        if (isTeamsValidationErrors) {
            this.setState({ teamsValidationErrors });
        }

        if (isSettingsFactorsValidationErrors || isTeamsValidationErrors) return;
        
        updatedTeams = getUpdatesToTeamsToSendToDb(this.originalValuesTeams, this.state.teams);

        newMyWatchlistTeams = getNewMyWatchlistTeamsToSendToDb(this.originalValuesMyWatchlistTeams, this.state.myWatchlistTeams);
        updatedMyWatchlistTeams = getUpdatesToMyWatchlistTeamsToSendToDb(this.originalValuesMyWatchlistTeams, this.state.myWatchlistTeams);
        deletedMyWatchlistTeams = getDeletedMyWatchlistTeamsToSendToDb(this.originalValuesMyWatchlistTeams, this.state.myWatchlistTeams);

        settingsFactors = getSettingsFactors(this.state, false, true, 'string');
        updatedSettingsFactors = getUpdatesToSettingsFactorsToSendToDb(this.originalValuesSettingsFactors, settingsFactors);
        updatedGoalFactors = getUpdatesToGoalFactorsToSendToDb(this.originalValuesSettingsFactors, settingsFactors);
        
        // Update the GOALS_PER_MINUTE_FACTOR (i.e. likelihoodOfAGoal) property, which is stored as a string so need to convert it to an array so that it gets saved in the database as an array
        settingsFactors.goalFactors[GOALS_PER_MINUTE_FACTOR] = helpers.getGoalsPerMinuteFactors(settingsFactors.goalFactors[GOALS_PER_MINUTE_FACTOR], 'array');

        // If any of the nested goalFactors object values have changes then send the whole nested goalFactors object, otherwise the database doesn't get updated correctly
        if (helpers.doesObjectHaveAnyProperties(updatedGoalFactors)) updatedSettingsFactors.goalFactors = settingsFactors.goalFactors;
        
        // if (updatedTeams.length === 0 && newMyWatchlistTeams.length === 0 && updatedMyWatchlistTeams.length === 0 && deletedMyWatchlistTeams.length === 0 &&
        //     !helpers.doesObjectHaveAnyProperties(updatedSettingsFactors)) return;         // If no changes have been made then exit

        this.setState({ dialogSaveChangesIsActive: true });

        this.props.settingsSaveChanges(updatedTeams, newMyWatchlistTeams, updatedMyWatchlistTeams, deletedMyWatchlistTeams, updatedSettingsFactors,
                                       { teams: this.state.teams, myWatchlistTeams: this.state.myWatchlistTeams, settingsFactors: settingsFactors }
        );
    }

    handleResetApp = () => this.setState({ dialogResetAppChoiceIsOpen: true });

    handleDialogResetAppClose = (value) => {
        debugger;
        this.setState({ dialogResetAppYesSelected: value === RESET_APP_KEEP_CURRENT_SETTINGS || value === RESET_APP_USE_SYSTEM_DEFAULTS }, () => {
            if (this.state.dialogResetAppYesSelected) {
                this.setState({ dialogResetAppIsActive: true });
                if (value === RESET_APP_KEEP_CURRENT_SETTINGS) {
                    this.props.settingsResetAppKeepCurrentSettings();              // Delete the stored app data in the database BUT keep the current settings
                } else if (value === RESET_APP_USE_SYSTEM_DEFAULTS) {
                    this.props.settingsResetApp();                                 // Delete the stored app data in the database and create new documents from the default values
                }
            } else {
                this.setState({ dialogResetAppChoiceIsOpen: false });
            }
        });
    }

    componentDidMount() {
        helpers.goToTopOfPage();
    }


    render() {
        const { haveChangesBeenMade, teams, myWatchlistTeams, settingsFactorsValidationErrors, teamsValidationErrors } = this.state;
        const { authenticated, loading, hasCompetitionStarted, hasCompetitionFinished } = this.props;
        
        return (
            <Fragment>
                <div className="outer-container-settings">

                    <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>

                    { loading && <Loading /> }

                    <Prompt when={haveChangesBeenMade} message={`Are you sure you want to abandon these unsaved changes'} ?`} />

                    <div className="container-main-content-settings">

                        {!authenticated &&
                            <CompetitionFinishedOrWrongStage
                            authenticated={authenticated}
                            hasCompetitionFinished={false}
                            displayHeader="Log in"
                            isSettingsNav={true}
                            />
                        }
                        
                        <SettingsHeader
                            authenticated={authenticated}
                            haveChangesBeenMade={haveChangesBeenMade}
                            onSaveChanges={this.handleSaveChanges}
                            onResetApp={this.handleResetApp}
                        />

                        {(areThereSettingsFactorsValidationErrors(settingsFactorsValidationErrors) || areThereTeamsValidationErrors(teamsValidationErrors)) &&
                            <div className="container-card display-validation-errors-message">
                                <h2>Unable to save ... please correct the errors highlighted in red</h2>
                            </div>
                        }

                        <div className="container-settings">

                            <div className="container-settings-factors">
                                <SettingsFactors
                                    hasCompetitionStarted={hasCompetitionStarted}
                                    hasCompetitionFinished={hasCompetitionFinished}
                                    settingsFactors={getSettingsFactors(this.state, false, false, 'string')}
                                    settingsFactorsValidationErrors={settingsFactorsValidationErrors}
                                    onChangeSettingsFactorsFields={this.handleChangeSettingsFactorsFields}
                                />
                            </div>

                            <div className="container-settings-teams">
                                {teams.map((division, divisionIndex) => {
                                    const divisionObjectKey = helpers.getObjectKey(division);
                                    return (
                                        <SettingsTeams
                                            key={divisionIndex}
                                            hasCompetitionStarted={hasCompetitionStarted}
                                            divisionIndex={divisionIndex}
                                            teams={division[divisionObjectKey]}
                                            teamsValidationErrors={teamsValidationErrors[divisionIndex][divisionObjectKey]}
                                            onTeamsInputChange={this.handleTeamsInputChange.bind(this)}
                                            onTopTeamsInputChange={this.handleTopTeamsInputChange.bind(this)}
                                        />
                                    );
                                })};
                            </div>

                            <div className="container-settings-my-watchlist-teams">
                                <SettingsMyWatchlistTeams
                                    authenticated={authenticated}
                                    hasCompetitionFinished={hasCompetitionFinished}
                                    teamsForCompetitionSelectOptions={this.teamsForCompetitionSelectOptions}
                                    myWatchlistTeams={myWatchlistTeams}
                                    onMyWatchlistTeamsAddTeam={this.handleMyWatchlistTeamsAddTeam.bind(this)}
                                    onMyWatchlistTeamsChangeTeam={this.handleMyWatchlistTeamsChangeTeam.bind(this)}
                                    onMyWatchlistTeamsDeleteTeam={this.handleMyWatchlistTeamsDeleteTeam.bind(this)}
                                />
                            </div>

                        </div>

                        {(areThereSettingsFactorsValidationErrors(settingsFactorsValidationErrors) || areThereTeamsValidationErrors(teamsValidationErrors)) &&
                            <div className="container-card display-validation-errors-message">
                                <h2>Unable to save ... please correct the errors highlighted in red</h2>
                            </div>
                        }
                        
                        <SettingsHeader
                            authenticated={authenticated}
                            haveChangesBeenMade={haveChangesBeenMade}
                            onSaveChanges={this.handleSaveChanges}
                            onResetApp={this.handleResetApp}
                        />

                        <ConfirmationDialog message="Changes saved" open={this.state.dialogSaveChangesIsOpen} onClose={() => this.setState({ dialogSaveChangesIsActive: false, dialogSaveChangesIsOpen: false })} />
                        <ConfirmationResetApp message="Are you sure you want to reset the app ?" open={this.state.dialogResetAppChoiceIsOpen} onClose={this.handleDialogResetAppClose} />
                        <ConfirmationDialog message="App has been reset" open={this.state.dialogResetAppConfirmIsOpen} onClose={() => this.setState({ dialogResetAppIsActive: false, dialogResetAppConfirmIsOpen: false })} />
                        <ConfirmationDialog message="An error has been encountered connecting to the backend ... please retry" open={this.state.dialogLoadingBackendErrorConfirmIsOpen} onClose={() => this.setState({ dialogLoadingBackendErrorConfirmIsOpen: false })} />
                        <ConfirmationDialog message="Changes saved" open={this.state.dialogSaveChangesIsOpen} onClose={() => this.setState({ dialogSaveChangesIsActive: false, dialogSaveChangesIsOpen: false })} />
                        <ConfirmationDialog title="Sign up complete" message="Please add 'My Watchlist Teams' at the bottom of this Settings page" open={this.state.dialogAddWatchlistTeamsPromptIsOpen} onClose={() => this.setState({ dialogAddWatchlistTeamsPromptIsOpen: false })} />

                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const { authenticated } = state.default.user;
    const { hasCompetitionStarted, hasCompetitionFinished, signingUpUser, loading, loadingBackendError } = state.default.miscellaneous;
    const { teamsForCompetition, myWatchlistTeams, settingsFactors } = state.default;

    return {
        authenticated,
        hasCompetitionStarted, hasCompetitionFinished, signingUpUser, loading, loadingBackendError,
        teamsForCompetition, myWatchlistTeams, settingsFactors,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        settingsSaveChanges: (updatedTeams, newMyWatchlistTeams, updatedMyWatchlistTeams, deletedMyWatchlistTeams, updatedSettingsFactors, data) =>
                             dispatch(settingsSaveChanges(updatedTeams, newMyWatchlistTeams, updatedMyWatchlistTeams, deletedMyWatchlistTeams, updatedSettingsFactors, data)),
        settingsResetAppKeepCurrentSettings: () => dispatch(settingsResetAppKeepCurrentSettings()),
        settingsResetApp: () => dispatch(settingsResetApp()),
    }
}


Settings.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    hasCompetitionStarted: PropTypes.bool.isRequired,
    hasCompetitionFinished: PropTypes.bool.isRequired,
    signingUpUser: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    loadingBackendError: PropTypes.bool.isRequired,
    teamsForCompetition: PropTypes.array.isRequired,
    myWatchlistTeams: PropTypes.array.isRequired,
    settingsFactors: PropTypes.object.isRequired,
    settingsSaveChanges: PropTypes.func.isRequired,
    settingsResetAppKeepCurrentSettings: PropTypes.func.isRequired,
    settingsResetApp: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
