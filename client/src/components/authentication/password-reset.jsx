import React, { Component } from 'react';

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { MAIN_BACKGROUND_IMAGE, FOOTBALL_IMAGE } from '../../utilities/constants';

import "./password-reset.scss";

const USER_DEFAULT_REQUIRED = 'Minimum 1 character required';
const USER_EMAIL_ADDRESS_REQUIRED = 'Minimum 1 character required';
const USER_EMAIL_ADDRESS_INVALID = 'Invalid Email address';

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class PasswordReset extends Component {

    constructor(props) {
        super(props);

        this.state = {
            formFields: {
                userEmailAddress: ''
            },
            formErrors: {
                userEmailAddress: ''
            },
            submitAttempted: false,
        }

        console.log(this.state);
    }

    handleChange = e => {
        const {name, value} = e.target;
        const {formFields, formErrors} = this.state;

        switch (name) {
            case "userEmailAddress":
                formErrors.userEmailAddress = value.length < 1 ? USER_EMAIL_ADDRESS_REQUIRED : "";
                formErrors.userEmailAddress = value.length > 0 && !EMAIL_REGEX.test(value) ? USER_EMAIL_ADDRESS_INVALID : formErrors.userEmailAddress
                break;
            default:
                break;
        }

        this.setState({ formFields: Object.assign(formFields, {[name]: value })});
        this.setState({ formErrors }, () => console.log(this.state));
    }

    handleSubmit = (e) => {

        e.preventDefault();

        const {formFields, formErrors} = this.state;

        this.setState({ submitAttempted: true });

        Object.keys(formFields).forEach(key => {
            if (formFields[key].trim() === '') {
                this.setState({ formErrors: Object.assign(formErrors, {[key]: USER_DEFAULT_REQUIRED})})
            }
        });

        if (this.formValid()) {

            // Do something with the details

            // Clear the form
            this.setState({ formFields: Object.assign(formFields, {userEmailAddress: ''})});
            this.setState({ formErrors: Object.assign(formErrors, {userEmailAddress: ''})});
            this.setState({ submitAttempted: false });

            console.log(`
                -- SUBMITTING --
                Email Address: ${formFields.userEmailAddress}
            `);
        } else {
            console.log("FORM INVALID");
        }
    }

    formValid = () => {
            let isValid = true;
            const {formFields, formErrors} = this.state;            
            Object.values(formErrors).forEach(val => { val.length > 0 && (isValid = false) });          // Validate form errors being empty            
            Object.values(formFields).forEach(val => { val.trim() === '' && (isValid = false) });       // Validate the form fields contained values
        return isValid;
    }

    render() {

        const {formFields: {userEmailAddress}, formErrors, submitAttempted} = this.state;

        return (
            <div className="container-main-content-password-reset">
            <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>
            <div className="container-card">
                    <header>
                        <img src={FOOTBALL_IMAGE} alt="" />
                        <h1>Password Reset</h1>
                        <img src={FOOTBALL_IMAGE} alt="" />                        
                    </header>

                    <div className="login">
                        <div className="main-form">
                            <form className="login-form">

                                <div className="login-form-full-width">
                                    <TextField
                                        type="text"
                                        id="userEmailAddress"
                                        name="userEmailAddress"
                                        label="Your Email address"
                                        className="form-control"
                                        required={true}
                                        fullWidth={true}
                                        value={userEmailAddress}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {submitAttempted && formErrors.userEmailAddress.length > 0 ? <div className="errorMessage">{formErrors.userEmailAddress}</div> : <div>&nbsp;</div>}

                            </form>

                            <div className="submit-button">
                                <Button variant="contained" color="primary" id="submit" onClick={this.handleSubmit}>Reset</Button>
                            </div>


                            { submitAttempted && !this.formValid() &&
                                <div className="invalid-form-message">
                                    <p>Invalid ... please check the details highlighted in red above</p>
                                </div>
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};

export default PasswordReset;