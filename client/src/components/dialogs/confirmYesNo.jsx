import React from 'react';
import PropTypes from 'prop-types';
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';

import './confirmYesNo.scss';

class ConfirmationYesNo extends React.Component {

    handleClose = (value) => {
        this.props.onClose(value);
    };
       
    render() {
        const { onClose, message="Are you sure ?", ...other } = this.props;
    
        return (
            <Dialog onClose={() => this.handleClose(false)} aria-labelledby="simple-dialog-title" {...other}>
                <div>
                    <p className="dialog-para">{message}</p>
                </div>
                <div className="dialog-buttons">
                    <Button variant="contained" color="primary" id="dialogConfirmNo" onClick={() => this.handleClose(false)}>No</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button variant="contained" color="primary" id="dialogConfirmYes" onClick={() => this.handleClose(true)}>Yes</Button>
                </div>
            </Dialog>
        );
    }
}


ConfirmationYesNo.propTypes = {
    onClose: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
}

export default ConfirmationYesNo;
