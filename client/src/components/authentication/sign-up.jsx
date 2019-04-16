import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';

import { userSignup } from '../../redux/actions/userActions';

import { MAIN_BACKGROUND_IMAGE, FOOTBALL_IMAGE, REDIRECT_TO_SETTINGS, USER_EMAIL_ADDRESS_INVALID, USER_PASSWORD_INVALID, USER_CONFIRM_PASSWORD_INVALID, EMAIL_REGEX, PASSWORD_REGEX} from '../../utilities/constants';

import "./authentication.scss";


class SignUp extends Component {

    constructor(props) {
        super(props);

        this.state = {
            formFields: {
                userEmailAddress: '',
                userPassword: '',
                userConfirmPassword: '',
            },
            formErrors: {
                userEmailAddress: '',
                userPassword: '',
                userConfirmPassword: '',
            },
            submitAttempted: false,
            rememberMe: false,
            invalidMessageLocal: '',
        }

    }

    handleChange = e => {
        const { name, value } = e.target;
        const { formFields, formErrors } = this.state;

        this.getValidationErrors(e.target);

        this.setState({ invalidMessageLocal: '' });
        this.setState({ formFields: Object.assign(formFields, {[name]: value })});
        this.setState({ formErrors });
        // this.setState({ formErrors }, () => console.log(this.state));
    }

    getValidationErrors = ({ name, value }) => {
        const { formFields, formErrors } = this.state;

        switch (name) {
            case "userEmailAddress":
                formErrors.userEmailAddress = !EMAIL_REGEX.test(value) ? USER_EMAIL_ADDRESS_INVALID : "";
                break;
            case "userPassword":
                formErrors.userPassword = !PASSWORD_REGEX.test(value) ? USER_PASSWORD_INVALID : "";
                formErrors.userConfirmPassword = (!formFields.userConfirmPassword || formFields.userConfirmPassword !== value) ? USER_CONFIRM_PASSWORD_INVALID : "";
                break;
            case "userConfirmPassword":
                formErrors.userConfirmPassword = (!value || value !== formFields.userPassword) ? USER_CONFIRM_PASSWORD_INVALID : "";
                break;
            default:
                break;
        }
    }

    handleSubmit = (e) => {

        e.preventDefault();

        const {formFields, formErrors} = this.state;

        this.setState({ submitAttempted: true, invalidMessageLocal: '' });

        // Validate the fields and update state if errors are different
        Object.keys(formFields).forEach(key => {
            const previousValidationError = formErrors[key];
            this.getValidationErrors({ name: key, value: formFields[key] });
            if (previousValidationError !== formErrors[key]) this.setState({ formErrors: Object.assign(formErrors) });
        });

        if (this.formValid()) {

            this.props.userSignup(formFields.userEmailAddress, formFields.userPassword);

            // console.log(`
            //     -- SUBMITTING --
            //     Email Address: ${formFields.userEmailAddress}
            //     // Password: ${formFields.userPassword}
            //     // Confirm Password: ${formFields.userConfirmPassword}
            // `);

        // } else {
        //     console.log("FORM INVALID");
        }
    }

    formValid = () => {
        let isValid = true;
        const {formFields, formErrors} = this.state;            
        Object.values(formErrors).forEach(val => { val.length > 0 && (isValid = false) });          // Validate form errors being empty            
        Object.values(formFields).forEach(val => { val.trim() === '' && (isValid = false) });       // Validate the form fields contained values
        return isValid;
    }

    componentWillReceiveProps(nextProps, prevState) {
        debugger;
        if (nextProps.authenticated && !this.props.authenticated) {
            // Re-route to the Settings page
            this.props.history.push(REDIRECT_TO_SETTINGS);
        } else if (this.state.submitAttempted && nextProps.invalidMessage) {
            this.setState({ invalidMessageLocal: nextProps.invalidMessage });
        }
    }

    render() {

        const { formFields: { userEmailAddress, userPassword, userConfirmPassword }, formErrors, submitAttempted, invalidMessageLocal } = this.state;

        return (
            <div className="outer-container-authentication">
                <div className="container-main-content-authentication">
                    <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>
                    <div className="container-card">
                        <header>
                            <img src={FOOTBALL_IMAGE} alt="" />
                            <h1>Sign up</h1>
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

                                    <div className="login-form-full-width">
                                        <TextField
                                            type="password"
                                            id="userPassword"
                                            name="userPassword"
                                            label="Your password"
                                            className="form-control"
                                            required={true}
                                            fullWidth={true}
                                            value={userPassword}
                                            onChange={this.handleChange}
                                        />        
                                    </div>
                                    {submitAttempted && formErrors.userPassword.length > 0 ? <div className="errorMessage">{formErrors.userPassword}</div> : <div>&nbsp;</div>}

                                    <div className="login-form-full-width">
                                        <TextField
                                            type="password"
                                            id="userConfirmPassword"
                                            name="userConfirmPassword"
                                            label="Confirm password"
                                            className="form-control"
                                            required={true}
                                            fullWidth={true}
                                            value={userConfirmPassword}
                                            onChange={this.handleChange}
                                        />        
                                    </div>
                                    {submitAttempted && formErrors.userConfirmPassword.length > 0 ? <div className="errorMessage">{formErrors.userConfirmPassword}</div> : <div>&nbsp;</div>}

                                    {/* <div className="remember-me">
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    className="rememberMe"
                                                    checked={this.state.rememberMe}
                                                    onChange={(e) => this.setState({rememberMe: e.target.checked})}
                                                    value={this.state.rememberMe.toString()}
                                                />
                                            }
                                            label="Remember me"
                                        />                        
                                    </div> */}

                                </form>

                                <div className="submit-button">
                                    <Button variant="contained" color="primary" id="submit" onClick={this.handleSubmit}>Sign up</Button>
                                </div>


                                { submitAttempted && !this.formValid() &&
                                    <div className="invalid-form-message">
                                        <p>Invalid ... please check the details highlighted in red above</p>
                                    </div>
                                }

                                { invalidMessageLocal &&
                                    <div className="invalid-form-message">
                                        <p>{invalidMessageLocal}</p>
                                    </div>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};


const mapStateToProps = (state) => {
    const { authenticated, invalidMessage } = state.default.user;
    debugger;
    return {
        authenticated,
        invalidMessage,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        userSignup: (emailAddress, password) => dispatch(userSignup({ emailAddress, password })),
    }
}

SignUp.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    invalidMessage: PropTypes.string,
    userSignup: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
