import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import { Prompt } from 'react-router';

import { MAIN_BACKGROUND_IMAGE, FOOTBALL_IMAGE, INCLUDE_FIREBASE_OPTION, SEASON, SEASON_START_DATE, NUMBER_OF_FIXTURES_FOR_SEASON, FIXTURE_UPDATE_INTERVAL, BASE_FOR_RANDOM_MULTIPLIER, AWAY_TEAM_FACTOR, IS_NOT_A_TOP_TEAM_FACTOR, GOALS_PER_MINUTE_FACTOR, IS_IT_A_GOAL_FACTOR } from '../../utilities/constants';
import { getAdminFactors } from '../../utilities/data';
import * as helpers from '../../utilities/helper-functions/helpers';
import { validateAdmin, areThereAnyChangesToTeamValues, areThereAnyChangesToAdminFactorsValues, getUpdatesToTeamsToSendToDb, getUpdatesToAdminFactorsToSendToDb, getUpdatesToGoalFactorsToSendToDb } from './administration-helpers';

import { adminSaveChanges, adminResetApp, adminCreateSeasonsFixtures } from '../../redux/actions/administrationActions';

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
// import FormLabel from '@material-ui/core/FormLabel';

import ConfirmationDialog from '../dialogs/confirmationDialog';
import ConfirmationYesNo from '../dialogs/confirmYesNo';

import Loading from '../loading/loading';

import "./administration.scss";

const LOCAL_STATE = {
    dataStorage: 'browser',
    dialogSaveChangesIsActive: false,
    dialogSaveChangesIsOpen: false,
    dialogCreateFixturesIsActive: false,
    dialogCreateFixturesYesNoIsOpen: false,
    dialogCreateFixturesYesSelected: false,
    dialogCreateFixturesConfirmIsOpen: false,
    dialogResetAppIsActive: false,
    dialogResetAppYesNoIsOpen: false,
    dialogResetAppYesSelected: false,
    dialogResetAppConfirmIsOpen: false,
    dialogLoadingBackendErrorConfirmIsOpen: false,
    haveChangesBeenMade: false,
}

class Administration extends Component {

    input;
    data;

    constructor(props) {
        super(props);

        this.state = Object.assign({}, LOCAL_STATE, { teams: props.teamsForSeason }, getAdminFactors(props.adminFactors, true, false, 'string'));

        this.updateOriginalValues('props', props.adminFactors);
    }

    updateOriginalValues = (sourceType, sourceArray) => {
        // These are used to see whether any values have changed so that a warning can be issued if the user trys to navigate away from the page
        this.originalValuesAdminFactors = Object.assign({}, getAdminFactors(sourceArray, sourceType === 'props', false, 'string'));
        this.originalValuesTeams = this.state.teams.map(a => ({...a}));         // Deep clone of object
    }

    componentWillReceiveProps(nextProps, prevState) {
        // The following is required in order to display the correct dialog message (i.e. it has either worked, or there has been a backend error)
        // console.log('nextProps loadAdmin', nextProps.miscellaneous.loadingAdmin);
        // console.log('nextProps error loadAdmin', nextProps.miscellaneous.loadingBackendError);
        // console.log('this.props loadAdmin', this.props.miscellaneous.loadingAdmin);
        // debugger;
        if (!nextProps.miscellaneous.loadingAdmin && this.props.miscellaneous.loadingAdmin) {
            this.checkForBackEndChanges(nextProps, 'dialogSaveChangesIsActive', 'dialogSaveChangesIsOpen');
            this.checkForBackEndChanges(nextProps, 'dialogCreateFixturesIsActive', 'dialogCreateFixturesConfirmIsOpen');
            this.checkForBackEndChanges(nextProps, 'dialogResetAppIsActive', 'dialogResetAppConfirmIsOpen');
        }
                
        let nextPropsAdminFactors = getAdminFactors(nextProps.adminFactors, true, true, 'string');      // Flatten the array to make it easier to compare
        let thisPropsAdminFactors = getAdminFactors(this.props.adminFactors, true, true, 'string');      // Flatten the array to make it easier to compare
        this.setStateOnChangeAdminFactors(nextPropsAdminFactors, thisPropsAdminFactors);

        this.setStateOnChangeTeams(nextProps);
    }

    checkForBackEndChanges = (nextProps, localStateActionIsActive, localStateFieldToUpdate) => {
        // If the new value of loadingAdmin is false and the old value is true then the appropriate update (i.e. to Save Changes, Reset App, or Create Fixtures) has completed.
        // If that has returned an error then display the error dialog, otherwise display the appropriate dialog to say that the process has completed.
        let saveChangesIsActive = (localStateActionIsActive === 'dialogSaveChangesIsActive');
        let createFixturesIsActive = (localStateActionIsActive === 'dialogCreateFixturesIsActive');
        let resetAppIsActive = (localStateActionIsActive === 'dialogResetAppIsActive');

        if (nextProps.miscellaneous.loadingBackendError) {
            this.setState({ dialogLoadingBackendErrorConfirmIsOpen: true });     // If an error was encountered on the backend, then open the backend error dialog
        } else {
            if (this.state[localStateActionIsActive]) {
                if (resetAppIsActive) this.setState({ dialogResetAppYesNoIsOpen: false });                  // Reset App has finished so set the flag which will close the Yes/No dialog
                if (createFixturesIsActive) this.setState({ dialogCreateFixturesYesNoIsOpen: false });      // Create Fixtures has finished so set the flag which will close the Yes/No dialog
                this.setState({ [localStateFieldToUpdate]: true });
                if (saveChangesIsActive || resetAppIsActive) {
                    this.setState({ haveChangesBeenMade: false });          // Set the flag which tracks whether any changes has been made back to false
                    this.updateOriginalValues('state', this.state);         // Update the original values which are compared to the current values to see whether any changes have been made
                }
            }
        }
    }

    setStateOnChangeAdminFactors = (obj, objPrevious, nestedObject = '') => {
        // If any of the AdminFactors values have changed then update local state
        let haveChangesBeenMade = false;
        Object.entries(obj).forEach(([key, val]) => {
            if (val && typeof val === 'object') {
                this.setStateOnChangeAdminFactors(val, objPrevious, key);  // recurse.
            } else {
                let valPrevious = (nestedObject !== '' ? objPrevious[nestedObject][key] : objPrevious[key]);
                if (val !== valPrevious) {
                    debugger;
                    this.setState({[key]: val});
                    haveChangesBeenMade = true;
                }
            }
        });
        if (haveChangesBeenMade) this.setState({ haveChangesBeenMade: true });
    };

    setStateOnChangeTeams = (nextProps) => {
        // If data has been loaded from the Teams database (i.e. _id is present) then update state, or if any of the values have changed then update state
        if ((nextProps.teamsForSeason[0]._id && !this.state.teams[0]._id) || areThereAnyChangesToTeamValues(nextProps.teamsForSeason, this.state.teams)) {
            this.setState({ teams: nextProps.teamsForSeason });
        }
    }

    handleChangeAdminFactorsFields = (field) => (e) => {
        this.setState({[field]: e.target.value})
        this.updateHaveChangesBeenMadeAfterUserEdit();
    }

    handleTeamsInputChange = (i, key) => (e) => {
        const newTeams = [...this.state.teams];
        newTeams[i][key] = (key === 'teamName' ? e.target.value : e.target.checked);
        this.setState({ teams: newTeams });
        this.updateHaveChangesBeenMadeAfterUserEdit();
    }

    updateHaveChangesBeenMadeAfterUserEdit = () => {
        // This is called whenever the user makes a change to the teams or any of the admin factors
        if (areThereAnyChangesToTeamValues(this.state.teams, this.originalValuesTeams) ||
            areThereAnyChangesToAdminFactorsValues(getAdminFactors(this.state, false, false, 'string'), this.originalValuesAdminFactors)) {
                this.setState({ haveChangesBeenMade: true });
        }
    }

    handleSaveChanges = (e) => {
        let adminFactors;
        let updatedTeams;
        let updatedAdminFactors;
        let updatedGoalFactors;

        e.preventDefault();
        
        if (validateAdmin(this.state)) return;

        updatedTeams = getUpdatesToTeamsToSendToDb(this.state.teams, this.originalValuesTeams);

        adminFactors = getAdminFactors(this.state, false, true, 'string');
        updatedAdminFactors = getUpdatesToAdminFactorsToSendToDb(adminFactors, this.originalValuesAdminFactors);
        updatedGoalFactors = getUpdatesToGoalFactorsToSendToDb(adminFactors, this.originalValuesAdminFactors);
        
        // Update the GOALS_PER_MINUTE_FACTOR (i.e. likelihoodOfAGoal) property, which is stored as a string so need to convert it to an array so that it gets saved in the database as an array
        adminFactors.goalFactors[GOALS_PER_MINUTE_FACTOR] = helpers.getGoalsPerMinuteFactors(adminFactors.goalFactors[GOALS_PER_MINUTE_FACTOR], 'array');

        // If any of the nested goalFactors object values have changes then send the whole nested goalFactors object, otherwise the database doesn't get updated correctly
        if (helpers.doesObjectHaveAnyProperties(updatedGoalFactors)) updatedAdminFactors.goalFactors = adminFactors.goalFactors;
        
        debugger;
        if (updatedTeams.length === 0 && !helpers.doesObjectHaveAnyProperties(updatedAdminFactors)) return;         // If no changes have been made then exit
        debugger;

        this.setState({ dialogSaveChangesIsActive: true });

        this.props.dispatch(adminSaveChanges(updatedTeams, updatedAdminFactors, { teams: this.state.teams, adminFactors }));
    }

    handleDialogYesNoCloseCreateFixtures = (value) => {
        // this.setState({ dialogCreateFixturesYesSelected: value, dialogCreateFixturesYesNoIsOpen: false }, () => {
        this.setState({ dialogCreateFixturesYesSelected: value }, () => {
            if (this.state.dialogCreateFixturesYesSelected) {
                this.setState({ dialogCreateFixturesIsActive: true });
                this.props.dispatch(adminCreateSeasonsFixtures());
            } else {
                this.setState({ dialogCreateFixturesYesNoIsOpen: false });
            }
        });
    }

    handleDialogYesNoCloseResetApp = (value) => {
        // this.setState({ dialogResetAppYesSelected: value, dialogResetAppYesNoIsOpen: false }, () => {
        this.setState({ dialogResetAppYesSelected: value }, () => {
            if (this.state.dialogResetAppYesSelected) {
                this.setState({ dialogResetAppIsActive: true });
                this.props.dispatch(adminResetApp());              // Delete the stored app data in the database and create new documents from the default values
            } else {
                this.setState({ dialogResetAppYesNoIsOpen: false });
            }
        });
    }

    componentDidMount() {
        helpers.goToTopOfPage();
    }


    render() {
        const { haveChangesBeenMade, teams } = this.state;
        const { authenticated } = this.props.user;
        const { fixturesForSeason } = this.props;
        const { loadingAdmin } = this.props.miscellaneous;

        return (
            <Fragment>
                <div className="outer-container-administration">
                    <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>
                    { loadingAdmin ? <Loading /> : null }
                    <div className="container-main-content-administration">
                        <div className="container-card header">
                            <header>
                                <img src={FOOTBALL_IMAGE} alt="" />
                                <h1>Administration</h1>
                                <span>For help, click on the Help link at the bottom of the screen</span>

                                <Prompt when={haveChangesBeenMade} message={`Are you sure you want to abandon these unsaved changes'} ?`} />

                                {INCLUDE_FIREBASE_OPTION &&
                                    <div className="dataStorage">
                                        {/* <FormControl component="fieldset" className={classes.formControl}> */}
                                        <span className="dataStorageLabel">Where is data saved?</span>
                                        <FormControl component="fieldset">
                                            {/* <FormLabel component="legend">Where is data saved?</FormLabel> */}
                                            <RadioGroup
                                                aria-label="Where is data saved?"
                                                name="dataStorage"
                                                className="dataStorageButtons"
                                                value={this.state.dataStorage}
                                                onChange={this.handleChange}
                                            >
                                                <FormControlLabel value="browser" control={<Radio />} label="Browser" labelplacement="start" />
                                                <FormControlLabel value="firebase" control={<Radio />} label="Firebase" labelplacement="start" />
                                            </RadioGroup>
                                        </FormControl>
                                            {/* <span>Where is data saved?</span>
                                            <mat-radio-group name="dataStorage">
                                                <mat-radio-button value="Browser">Browser</mat-radio-button>
                                                <mat-radio-button value="Firebase">Firebase</mat-radio-button>
                                            </mat-radio-group> */}
                                    </div>
                                }
                            </header>
                        </div>

                        <form>
                            <div className="container-admin">
                                <div className="container-admin-teams">
                                    <div className="container-card">
                                        <h2>Teams for the Season</h2>

                                        <table className="admin-teams">
                                            <thead>
                                                <tr className="teams-header">
                                                <th className="admin-team-number">No.</th>
                                                <th className="admin-team-team">Team</th>
                                                <th className="admin-team-top-team">Top Team?</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {teams.map((team, i) => {
                                                    return (
                                                        <tr key={i} className="team-row">
                                                            <td className="admin-team-number">{i + 1}</td>
                                                            <td><input type="text" onChange={this.handleTeamsInputChange(i, 'teamName')} value={team.teamName} /></td>
                                                            <td><input type="checkbox" onChange={this.handleTeamsInputChange(i, 'isATopTeam')} defaultChecked={team.isATopTeam} value={team.isATopTeam} /></td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="container-admin-factors">

                                    <div className="container-card">
                                        <h2>Information for the Season</h2>

                                        <div className="grid-season-info">

                                            <TextField
                                                id={SEASON}
                                                label="Season"
                                                placeholder="e.g. 2017/18"
                                                className="form-control"
                                                value={this.state[SEASON]}
                                                onChange={this.handleChangeAdminFactorsFields(SEASON)}
                                            />

                                            <TextField
                                                id={SEASON_START_DATE}
                                                label="Season Start Date"
                                                placeholder="e.g. 05 Aug 2017"
                                                className="form-control"
                                                value={this.state[SEASON_START_DATE]}
                                                onChange={this.handleChangeAdminFactorsFields(SEASON_START_DATE)}
                                            />

                                            <TextField
                                                id={NUMBER_OF_FIXTURES_FOR_SEASON}
                                                label="Number of Fixtures for Season"
                                                placeholder="e.g. 38"
                                                className="form-control"
                                                value={this.state[NUMBER_OF_FIXTURES_FOR_SEASON]}
                                                onChange={this.handleChangeAdminFactorsFields(NUMBER_OF_FIXTURES_FOR_SEASON)}
                                            />

                                        </div>

                                    </div>

                                    <div className="container-card">
                                        <h2>Match Score Factors</h2>

                                        <div className="grid-season-info">

                                            <TextField
                                                id={FIXTURE_UPDATE_INTERVAL}
                                                label="Fixture Update Interval (seconds)"
                                                placeholder="e.g. 0.5"
                                                className="form-control"
                                                value={this.state[FIXTURE_UPDATE_INTERVAL]}
                                                onChange={this.handleChangeAdminFactorsFields(FIXTURE_UPDATE_INTERVAL)}
                                            />

                                            <TextField
                                                id={BASE_FOR_RANDOM_MULTIPLIER}
                                                label="Base For Random Multiplier"
                                                placeholder="e.g. 90"
                                                className="form-control"
                                                value={this.state[BASE_FOR_RANDOM_MULTIPLIER]}
                                                onChange={this.handleChangeAdminFactorsFields(BASE_FOR_RANDOM_MULTIPLIER)}
                                            />

                                            <TextField
                                                id={AWAY_TEAM_FACTOR}
                                                label="Away Team Factor"
                                                placeholder="e.g. 1.1"
                                                className="form-control"
                                                value={this.state[AWAY_TEAM_FACTOR]}
                                                onChange={this.handleChangeAdminFactorsFields(AWAY_TEAM_FACTOR)}
                                            />

                                            <TextField
                                                id={IS_NOT_A_TOP_TEAM_FACTOR}
                                                label="Is Not A Top Team Factor"
                                                placeholder="e.g. 1.1"
                                                className="form-control"
                                                value={this.state[IS_NOT_A_TOP_TEAM_FACTOR]}
                                                onChange={this.handleChangeAdminFactorsFields(IS_NOT_A_TOP_TEAM_FACTOR)}
                                            />

                                            <div className="fullWidth">
                                                <TextField
                                                    id={GOALS_PER_MINUTE_FACTOR}
                                                    label="Goals Per Minute Factor"
                                                    placeholder="e.g. [{'minutes': 30, 'factor': 1.8}, {'minutes': 80, 'factor': 1.2}, {'minutes': 120, 'factor': 1}]"
                                                    className="form-control"
                                                    fullWidth
                                                    value={this.state[GOALS_PER_MINUTE_FACTOR]}
                                                    onChange={this.handleChangeAdminFactorsFields(GOALS_PER_MINUTE_FACTOR)}
                                                />
                                            </div>

                                            <TextField
                                                id={IS_IT_A_GOAL_FACTOR}
                                                label="Is It A Goal Factor"
                                                placeholder="e.g. 2"
                                                className="form-control"
                                                value={this.state[IS_IT_A_GOAL_FACTOR]}
                                                onChange={this.handleChangeAdminFactorsFields(IS_IT_A_GOAL_FACTOR)}
                                            />

                                        </div>
                                    </div>

                                    <div className="container-card buttons-card">
                                        <div className="buttons">
                                            {!authenticated && <p>Please log in or sign up in order to use the app</p>}
                                            <Button variant="contained" color="primary" id="saveChanges" disabled={!authenticated} onClick={this.handleSaveChanges}>Save Changes</Button>
                                            &nbsp; &nbsp;
                                            <Button variant="contained" color="secondary" id="createFixtures" disabled={!authenticated || fixturesForSeason.length > 0} onClick={() => this.state.haveChangesBeenMade ? alert('Changes have been made ... please save these first and re-try') : this.setState({dialogCreateFixturesYesNoIsOpen: true})}>Create Season's Fixtures</Button>
                                            &nbsp; &nbsp;
                                            <Button variant="contained" color="secondary" id="resetApp" disabled={!authenticated} onClick={() => this.setState({dialogResetAppYesNoIsOpen: true})}>Reset App</Button>

                                            <ConfirmationDialog message="Changes saved" open={this.state.dialogSaveChangesIsOpen} onClose={() => this.setState({ dialogSaveChangesIsActive: false, dialogSaveChangesIsOpen: false })} />
                                            <ConfirmationYesNo message="Are you sure you want to create fixtures for the season ?" dialogYesNoSelectedIsYes={this.state.dialogCreateFixturesYesSelected} open={this.state.dialogCreateFixturesYesNoIsOpen} onClose={this.handleDialogYesNoCloseCreateFixtures} />
                                            <ConfirmationDialog message="Season's fixtures created" open={this.state.dialogCreateFixturesConfirmIsOpen} onClose={() => this.setState({ dialogCreateFixturesIsActive: false, dialogCreateFixturesConfirmIsOpen: false })} />
                                            <ConfirmationYesNo message="Are you sure you want to reset the app ?" dialogYesNoSelectedIsYes={this.state.dialogResetAppYesSelected} open={this.state.dialogResetAppYesNoIsOpen} onClose={this.handleDialogYesNoCloseResetApp} />
                                            <ConfirmationDialog message="App has been reset" open={this.state.dialogResetAppConfirmIsOpen} onClose={() => this.setState({ dialogResetAppIsActive: false, dialogResetAppConfirmIsOpen: false })} />
                                            <ConfirmationDialog message="An error has been encountered connecting to the backend ... please retry" open={this.state.dialogLoadingBackendErrorConfirmIsOpen} onClose={() => this.setState({ dialogLoadingBackendErrorConfirmIsOpen: false })} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.default.user,
        fixturesForSeason: state.default.fixturesForSeason,
        teamsForSeason: state.default.teamsForSeason,
        adminFactors: state.default.adminFactors,
        miscellaneous: state.default.miscellaneous,
    }
}


Administration = connect(mapStateToProps, null)(Administration)

export default Administration;