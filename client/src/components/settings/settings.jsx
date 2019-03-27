import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { Prompt } from 'react-router';

import { MAIN_BACKGROUND_IMAGE, GOALS_PER_MINUTE_FACTOR, DIVISIONS } from '../../utilities/constants';
import * as helpers from '../../utilities/helper-functions/helpers';
import SettingsHeader from './settings-header';
import SettingsFactors from './settings-factors';
import SettingsTeams from './settings-teams';
import SettingsMyWatchlistTeams from './settings-my-watchlist-teams';

import { getSettingsFactors, areThereSettingsFactorsValidationErrors, areThereTeamsValidationErrors, areThereAnyChangesToTeamValues, areThereAnyChangesToMyWatchlistTeamValues,
         areThereAnyChangesToSettingsFactorsValues, getUpdatesToTeamsToSendToDb, getNewMyWatchlistTeamsToSendToDb,
         getUpdatesToMyWatchlistTeamsToSendToDb, getDeletedMyWatchlistTeamsToSendToDb, getUpdatesToSettingsFactorsToSendToDb, getUpdatesToGoalFactorsToSendToDb,
         getNewTeamsArray, getNewMyWatchlistTeamsArray, deleteTeamFromMyWatchlistTeamsArray, validateSettingsFactors, validateTeams,
         getTeamsValidationError, blankTeamsValidationError } from './settings-helpers';

import { settingsSaveChanges, settingsResetApp } from '../../redux/actions/settingsActions';

import ConfirmationDialog from '../dialogs/confirmationDialog';
import ConfirmationYesNo from '../dialogs/confirmYesNo';

import Loading from '../loading/loading';

import "./settings.scss";

const LOCAL_STATE = {
    dataStorage: 'browser',
    dialogSaveChangesIsActive: false,
    dialogSaveChangesIsOpen: false,
    dialogResetAppIsActive: false,
    dialogResetAppYesNoIsOpen: false,
    dialogResetAppYesSelected: false,
    dialogResetAppConfirmIsOpen: false,
    dialogLoadingBackendErrorConfirmIsOpen: false,
    haveChangesBeenMade: false,
}

class Settings extends Component {

    input;
    data;
    teamsForCompetitionFlattened;

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

        this.teamsForCompetitionFlattened = helpers.getTeamsForCompetitionFlattened(props.teamsForCompetition);
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
        // console.log('nextProps loadingSettings', nextProps.miscellaneous.loadingSettings);
        // console.log('nextProps error loadingSettings', nextProps.miscellaneous.loadingBackendError);
        // console.log('this.props loadingSettings', this.props.miscellaneous.loadingSettings);

        if (!nextProps.miscellaneous.loadingSettings && this.props.miscellaneous.loadingSettings) {
            this.checkForBackEndChanges(nextProps, 'dialogSaveChangesIsActive', 'dialogSaveChangesIsOpen');
            this.checkForBackEndChanges(nextProps, 'dialogResetAppIsActive', 'dialogResetAppConfirmIsOpen');
        }
        
        let nextPropsSettingsFactors = getSettingsFactors(nextProps.settingsFactors, true, true, 'string');      // Flatten the array to make it easier to compare
        let thisPropsSettingsFactors = getSettingsFactors(this.props.settingsFactors, true, true, 'string');      // Flatten the array to make it easier to compare

        this.setStateOnChangeSettingsFactors(nextPropsSettingsFactors, thisPropsSettingsFactors);

        this.setStateOnChangeTeams(nextProps);

        this.setStateOnChangeMyWatchlistTeams(nextProps);
    }

    checkForBackEndChanges = (nextProps, localStateActionIsActive, localStateFieldToUpdate) => {
        // If the new value of loadingSettings is false and the old value is true then the appropriate update (i.e. to Save Changes or Reset App) has completed.
        // If that has returned an error then display the error dialog, otherwise display the appropriate dialog to say that the process has completed.
        let saveChangesIsActive = (localStateActionIsActive === 'dialogSaveChangesIsActive');
        let resetAppIsActive = (localStateActionIsActive === 'dialogResetAppIsActive');

        if (nextProps.miscellaneous.loadingBackendError) {
            this.setState({ dialogLoadingBackendErrorConfirmIsOpen: true });     // If an error was encountered on the backend, then open the backend error dialog
        } else {
            if (this.state[localStateActionIsActive]) {
                if (resetAppIsActive) this.setState({ dialogResetAppYesNoIsOpen: false });                  // Reset App has finished so set the flag which will close the Yes/No dialog
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

        debugger;
        
        const settingsFactorsValidationErrors = validateSettingsFactors(this.state);
        if (areThereSettingsFactorsValidationErrors(settingsFactorsValidationErrors)) {
            this.setState({ settingsFactorsValidationErrors: settingsFactorsValidationErrors });
            return;
        }
        
        const teamsValidationErrors = validateTeams(this.state);
        if (areThereTeamsValidationErrors(teamsValidationErrors)) {
            this.setState({ teamsValidationErrors });
            return;
        }
        
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

        this.props.dispatch(settingsSaveChanges(updatedTeams, newMyWatchlistTeams, updatedMyWatchlistTeams, deletedMyWatchlistTeams, updatedSettingsFactors,
            { teams: this.state.teams, myWatchlistTeams: this.state.myWatchlistTeams, settingsFactors: settingsFactors }
        ));
    }

    handleResetApp = () => this.setState({ dialogResetAppYesNoIsOpen: true });

    handleDialogYesNoCloseResetApp = (value) => {
        // this.setState({ dialogResetAppYesSelected: value, dialogResetAppYesNoIsOpen: false }, () => {
        this.setState({ dialogResetAppYesSelected: value }, () => {
            if (this.state.dialogResetAppYesSelected) {
                this.setState({ dialogResetAppIsActive: true });
                this.props.dispatch(settingsResetApp());              // Delete the stored app data in the database and create new documents from the default values
            } else {
                this.setState({ dialogResetAppYesNoIsOpen: false });
            }
        });
    }

    componentDidMount() {
        helpers.goToTopOfPage();
    }


    render() {
        const { haveChangesBeenMade, teams, myWatchlistTeams, settingsFactorsValidationErrors, teamsValidationErrors } = this.state;
        const { authenticated } = this.props.user;
        const { loadingSettings, hasCompetitionStarted, hasCompetitionFinished } = this.props.miscellaneous;
        
        return (
            <Fragment>
                <div className="outer-container-settings">
                    <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>
                    { loadingSettings ? <Loading /> : null }
                    <Prompt when={haveChangesBeenMade} message={`Are you sure you want to abandon these unsaved changes'} ?`} />
                    <div className="container-main-content-settings">

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
                                    hasCompetitionFinished={hasCompetitionFinished}
                                    teamsForCompetitionFlattened={this.teamsForCompetitionFlattened}
                                    authenticated={authenticated}
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
                        <ConfirmationYesNo message="Are you sure you want to reset the app ?" dialogYesNoSelectedIsYes={this.state.dialogResetAppYesSelected} open={this.state.dialogResetAppYesNoIsOpen} onClose={this.handleDialogYesNoCloseResetApp} />
                        <ConfirmationDialog message="App has been reset" open={this.state.dialogResetAppConfirmIsOpen} onClose={() => this.setState({ dialogResetAppIsActive: false, dialogResetAppConfirmIsOpen: false })} />
                        <ConfirmationDialog message="An error has been encountered connecting to the backend ... please retry" open={this.state.dialogLoadingBackendErrorConfirmIsOpen} onClose={() => this.setState({ dialogLoadingBackendErrorConfirmIsOpen: false })} />
                        <ConfirmationDialog message="Changes saved" open={this.state.dialogSaveChangesIsOpen} onClose={() => this.setState({ dialogSaveChangesIsActive: false, dialogSaveChangesIsOpen: false })} />

                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    debugger;
    return {
        user: state.default.user,
        teamsForCompetition: state.default.teamsForCompetition,
        myWatchlistTeams: state.default.myWatchlistTeams,
        settingsFactors: state.default.settingsFactors,
        miscellaneous: state.default.miscellaneous,
    }
}


export default connect(mapStateToProps, null)(Settings);