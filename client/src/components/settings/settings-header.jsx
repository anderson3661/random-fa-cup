import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import PropTypes from 'prop-types';

import { FOOTBALL_IMAGE, INCLUDE_FIREBASE_OPTION } from '../../utilities/constants';


class SettingsHeader extends Component {

    // <span>For help, click on the Help link at the bottom of the screen</span>

    handleSaveChanges = (e) => this.props.onSaveChanges(e);
    handleResetApp = () => this.props.onResetApp();

    shouldComponentUpdate(nextProps) {
        return this.props.haveChangesBeenMade !== nextProps.haveChangesBeenMade;
    }

    render() {
        const { authenticated, haveChangesBeenMade } = this.props;

        return (
            
            <div className="container-card header">

                <header>

                    <img src={FOOTBALL_IMAGE} alt="" />

                    <div className="heading-and-buttons">
                        {/* {!authenticated && <p>Please log in or sign up in order to use the app</p>} */}
                        <span className="heading">Settings</span>
                        <Button variant="contained" color="primary" id="saveChanges" disabled={!authenticated || !haveChangesBeenMade} onClick={this.handleSaveChanges}>Save Changes</Button>
                        <Button variant="contained" color="secondary" id="resetApp" disabled={!authenticated} onClick={this.handleResetApp}>Reset App</Button>
                    </div>

                    <img src={FOOTBALL_IMAGE} alt="" />

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

        );
    }
}


SettingsHeader.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    haveChangesBeenMade: PropTypes.bool.isRequired,
    onSaveChanges: PropTypes.func.isRequired,
    onResetApp: PropTypes.func.isRequired,
}

export default SettingsHeader;
