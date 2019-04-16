import React from 'react';
import PropTypes from 'prop-types';
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';

import { FA_CUP_SMALL_IMAGE } from '../../utilities/constants';

import './confirmationDialogWinners.scss';

class ConfirmationDialogWinners extends React.Component {

    handleClose = () => {
        this.props.onClose();
    };
        
    render() {
        const { season, winners, onClose, ...other } = this.props;

        return (
        <Dialog className="dialog-winners" onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
            <img className="confetti" src={require('../../assets/images/confetti.png')} alt="" />

            <header>
                <div className="filler"></div>
                <img src={FA_CUP_SMALL_IMAGE} alt="" />
                <div className="heading">
                    <p className="dialog-para main">Congratulations</p>
                    <p className="dialog-para">{`${season} Random FA Cup winners`}</p>
                </div>
                <img src={FA_CUP_SMALL_IMAGE} alt="" />
                <div className="filler"></div>
            </header>


            <p className="winners">{winners}</p>

            <div className="dialog-button">
                <Button variant="contained" color="primary" id="dialogConfirm" onClick={this.handleClose}>Close</Button>
            </div>
        </Dialog>
        );
    }
}


ConfirmationDialogWinners.propTypes = {
    season: PropTypes.string.isRequired,
    winners: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default ConfirmationDialogWinners;
