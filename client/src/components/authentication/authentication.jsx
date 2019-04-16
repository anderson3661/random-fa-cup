import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { userSignup, userLogin, userResetPassword, userChangePassword } from '../../redux/actions/userActions';

import { TESTING_MODE, TESTING_EMAIL_ADDRESS, TESTING_PASSWORD, MAIN_BACKGROUND_IMAGE, FOOTBALL_IMAGE, REDIRECT_TO_HOME, REDIRECT_TO_SETTINGS,
         USER_EMAIL_ADDRESS_INVALID, USER_PASSWORD_INVALID, USER_CONFIRM_PASSWORD_INVALID, EMAIL_REGEX, PASSWORD_REGEX,
         PATH_USER_RESET_PASSWORD, PATH_USER_CHANGE_PASSWORD} from '../../utilities/constants';

import "./authentication.scss";


class Authentication extends Component {

    constructor(props) {
        super(props);

        this.state = {
            formFields: this.getBlankFormFields(),
            formErrors: this.getBlankFormErrors(),
            submitAttempted: false,
            rememberMe: false,
            invalidMessageLocal: '',
        }

    }

    getBlankFormFields = () => {
        return {
            userEmailAddress: TESTING_MODE ? TESTING_EMAIL_ADDRESS : '',
            userOldPassword: TESTING_MODE ? TESTING_PASSWORD : '',
            userPassword: TESTING_MODE ? TESTING_PASSWORD : '',
            userConfirmPassword: TESTING_MODE ? TESTING_PASSWORD : '',
        }
    }

    getBlankFormErrors = () => {
        return {
            userEmailAddress: '',
            userOldPassword: '',
            userPassword: '',
            userConfirmPassword: '',
        }
    }

    handleChange = e => {
        const { name, value } = e.target;
        const { formFields, formErrors } = this.state;

        this.getValidationErrors(e.target);

        this.setState({ invalidMessageLocal: '' });
        this.setState({ formFields: Object.assign(formFields, {[name]: value })});
        this.setState({ formErrors });                      // this.setState({ formErrors }, () => console.log(this.state));        
    }

    getValidationErrors = ({ name, value }) => {
        const { formFields, formErrors } = this.state;
        const { isLogin, isChangePassword } = this.props;

        switch (name) {
            case "userEmailAddress":
                formErrors.userEmailAddress = !EMAIL_REGEX.test(value) ? USER_EMAIL_ADDRESS_INVALID : "";
                break;
            case "userOldPassword":
                if (isChangePassword) formErrors.userOldPassword = !PASSWORD_REGEX.test(value) ? USER_PASSWORD_INVALID : "";
                break;
            case "userPassword":
                formErrors.userPassword = !PASSWORD_REGEX.test(value) ? USER_PASSWORD_INVALID : "";
                if (!isLogin) formErrors.userConfirmPassword = (!formFields.userConfirmPassword || formFields.userConfirmPassword !== value) ? USER_CONFIRM_PASSWORD_INVALID : "";
                break;
            case "userConfirmPassword":
                if (!isLogin) formErrors.userConfirmPassword = (!value || value !== formFields.userPassword) ? USER_CONFIRM_PASSWORD_INVALID : "";
                break;
            default:
                break;
        }
    }

    handleSubmit = (e) => {

        e.preventDefault();

        const { formFields, formErrors } = this.state;
        const { isSignUp, isLogin, isResetPassword, isChangePassword, userSignup, userLogin, userResetPassword, userChangePassword } = this.props;

        this.setState({ submitAttempted: true, invalidMessageLocal: '' });

        // Validate the fields and update state if errors are different
        Object.keys(formFields).forEach(key => {
            const previousValidationError = formErrors[key];
            this.getValidationErrors({ name: key, value: formFields[key] });
            if (previousValidationError !== formErrors[key]) this.setState({ formErrors: Object.assign(formErrors) });
        });

        debugger;

        if (this.formValid()) {

            if (isSignUp) userSignup(formFields.userEmailAddress, formFields.userPassword);
            if (isLogin) userLogin(formFields.userEmailAddress, formFields.userPassword);
            if (isResetPassword) userResetPassword(formFields.userEmailAddress, formFields.userPassword);
            if (isChangePassword) userChangePassword(formFields.userEmailAddress, formFields.userOldPassword, formFields.userPassword);

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
        const {isLogin, isChangePassword} = this.props;

        // Object.values(formFields).forEach(val => { val.trim() === '' && (isValid = false) });       // Validate the form fields contained values
        Object.entries(formFields).forEach(([key, val]) => {
            if ((key === "userEmailAddress" || key === "userPassword" ||
               (key === "userOldPassword" && isChangePassword) ||
               (key === "userConfirmPassword" && !isLogin)) &&
               val.trim() === '') isValid = false;
        });
        Object.values(formErrors).forEach(val => { val.length > 0 && (isValid = false) });          // Validate form errors being empty            
        return isValid;
    }

    componentWillReceiveProps(nextProps, prevState) {
        debugger;
        if ((nextProps.authenticated && !this.props.authenticated) || (TESTING_MODE && nextProps.authenticated && this.props.authenticated)) {
            if (nextProps.isSignUp) this.props.history.push(REDIRECT_TO_SETTINGS);                                     // Re-route to the Settings page
            if (nextProps.isLogin) this.props.history.push(REDIRECT_TO_HOME);                                          // Re-route to the Home page
            if (nextProps.isResetPassword) this.props.history.push(REDIRECT_TO_HOME);                                  // Re-route to the Home page
            if (nextProps.isChangePassword) this.props.history.push(REDIRECT_TO_HOME);                                 // Re-route to the Home page
        } else if ((nextProps.isSignUp && !this.props.isSignUp) || (nextProps.isLogin && !this.props.isLogin) || (nextProps.isResetPassword && !this.props.isResetPassword) || (nextProps.isChangePassword && !this.props.isChangePassword)) {
            this.setState({ formFields: this.getBlankFormFields() });
            this.setState({ formErrors: this.getBlankFormErrors() });
            this.setState({ submitAttempted: false, invalidMessageLocal: '' });
        } else if (this.state.submitAttempted && nextProps.invalidMessage) {
            this.setState({ invalidMessageLocal: nextProps.invalidMessage });
        }
    }

    render() {

        const { formFields: { userEmailAddress, userOldPassword, userPassword, userConfirmPassword }, formErrors, submitAttempted, invalidMessageLocal } = this.state;
        const { isSignUp, isLogin, isResetPassword, isChangePassword } = this.props;

        const label = isSignUp ? 'Sign up' : (isLogin ? 'Log in' : (isResetPassword ? 'Reset Password' : (isChangePassword ? 'Change Password' : '???')));

        return (
            <div className="outer-container-authentication">
                <div className="container-main-content-authentication">
                    <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>
                    <div className="container-card">
                        <header>
                            <img src={FOOTBALL_IMAGE} alt="" />
                            <h1>{label}</h1>
                            <img src={FOOTBALL_IMAGE} alt="" />                        
                        </header>

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

                            {(isChangePassword) &&
                                <Fragment>
                                    <div className="login-form-full-width">
                                        <TextField
                                            type="password"
                                            id="userOldPassword"
                                            name="userOldPassword"
                                            label="Your old password"
                                            className="form-control"
                                            required={true}
                                            fullWidth={true}
                                            value={userOldPassword}
                                            onChange={this.handleChange}
                                        />        
                                    </div>                                        
                                    {submitAttempted && formErrors.userOldPassword.length > 0 ? <div className="errorMessage">{formErrors.userOldPassword}</div> : <div>&nbsp;</div>}
                                </Fragment>
                            }

                            <div className="login-form-full-width">
                                <TextField
                                    type="password"
                                    id="userPassword"
                                    name="userPassword"
                                    label={`Your ${isResetPassword || isChangePassword ? 'new' : ''} password`}
                                    className="form-control"
                                    required={true}
                                    fullWidth={true}
                                    value={userPassword}
                                    onChange={this.handleChange}
                                />        
                            </div>
                            {submitAttempted && formErrors.userPassword.length > 0 ? <div className="errorMessage">{formErrors.userPassword}</div> : <div>&nbsp;</div>}

                            {(isSignUp || isResetPassword || isChangePassword) &&
                                <Fragment>
                                    <div className="login-form-full-width">
                                        <TextField
                                            type="password"
                                            id="userConfirmPassword"
                                            name="userConfirmPassword"
                                            label={`Confirm ${isResetPassword || isChangePassword ? 'new' : ''} password`}
                                            className="form-control"
                                            required={true}
                                            fullWidth={true}
                                            value={userConfirmPassword}
                                            onChange={this.handleChange}
                                        />        
                                    </div>
                                    {submitAttempted && formErrors.userConfirmPassword.length > 0 ? <div className="errorMessage">{formErrors.userConfirmPassword}</div> : <div>&nbsp;</div>}
                                </Fragment>
                            }

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

                            <div className="submit">
                                <Button variant="contained" color="primary" id="submit" onClick={this.handleSubmit}>{label}</Button>
                                <div>
                                    {isLogin && <div className="reset-password"><NavLink to={PATH_USER_RESET_PASSWORD}>Forgotten your password?</NavLink></div>}
                                    {isLogin && <div className="change-password"><NavLink to={PATH_USER_CHANGE_PASSWORD}>Change your password?</NavLink></div>}
                                </div>
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

                        </form>                            
                    </div>
                </div>
            </div>
        );
    };
};


const mapStateToProps = (state, ownProps) => {
    const { authenticated, invalidMessage } = state.default.user;
    const { isSignUp, isLogin, isResetPassword, isChangePassword } = ownProps;
    debugger;
    return {
        authenticated,
        invalidMessage,
        isSignUp,
        isLogin,
        isResetPassword,
        isChangePassword,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        userSignup: (emailAddress, password) => dispatch(userSignup({ emailAddress, password })),
        userLogin: (emailAddress, password) => dispatch(userLogin({ emailAddress, password })),
        userResetPassword: (emailAddress, password) => dispatch(userResetPassword({ emailAddress, password })),
        userChangePassword: (emailAddress, oldPassword, password) => dispatch(userChangePassword({ emailAddress, oldPassword, password })),
    }
}

Authentication.defaultProps = {
    isSignUp: false,
    isLogin: false,
    isResetPassword: false,
    isChangePassword: false,
}

Authentication.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    invalidMessage: PropTypes.string,
    isSignUp: PropTypes.bool.isRequired,
    isLogin: PropTypes.bool.isRequired,
    isResetPassword: PropTypes.bool.isRequired,
    isChangePassword: PropTypes.bool.isRequired,
    userSignup: PropTypes.func.isRequired,
    userLogin: PropTypes.func.isRequired,
    userResetPassword: PropTypes.func.isRequired,
    userChangePassword: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(Authentication);
