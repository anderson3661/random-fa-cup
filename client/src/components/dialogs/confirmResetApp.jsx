import React from 'react';
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';

import { RESET_APP_CONFIRM_NO, RESET_APP_KEEP_CURRENT_SETTINGS, RESET_APP_USE_SYSTEM_DEFAULTS } from '../../utilities/constants';

import './confirmResetApp.scss';


class ConfirmationResetApp extends React.Component {

    handleClose = (value) => {
        this.props.onClose(value);
    };
       
    render() {
        const { onClose, message="Are you sure ?", ...other } = this.props;
    
        return (
            <Dialog onClose={() => this.handleClose(RESET_APP_CONFIRM_NO)} aria-labelledby="simple-dialog-title" {...other}>
                <div>
                    <p className="dialog-para">{message}</p>
                </div>
                <div className="dialog-buttons">
                    <Button variant="contained" color="primary" id="dialogConfirmUseSavedSettings" onClick={() => this.handleClose(RESET_APP_CONFIRM_NO)}>No</Button>
                    <Button variant="contained" color="primary" id="dialogConfirmUseSavedSettings" onClick={() => this.handleClose(RESET_APP_KEEP_CURRENT_SETTINGS)}>Yes - Keep Current Settings</Button>
                    <Button variant="contained" color="primary" id="dialogConfirmUseSystemDefaults" onClick={() => this.handleClose(RESET_APP_USE_SYSTEM_DEFAULTS)}>Yes - Use System Defaults</Button>
                </div>
            </Dialog>
        );
    }
  }
      
  export default ConfirmationResetApp;