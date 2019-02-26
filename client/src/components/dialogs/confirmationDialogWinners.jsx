import React from 'react';
import Button from "@material-ui/core/Button";

import Dialog from '@material-ui/core/Dialog';
// import DialogTitle from '@material-ui/core/DialogTitle';

import { FOOTBALL_IMAGE } from '../../utilities/constants';

import './confirmationDialogWinners.scss';

class ConfirmationDialogWinners extends React.Component {

    handleClose = () => {
        this.props.onClose();
    };
        
    render() {
        const { winners, onClose, ...other } = this.props;

        return (
        <Dialog className="dialog-winners" onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
            {/* <DialogTitle class="dialog-title">Save</DialogTitle> */}
            <img className="confetti" src={require('../../assets/images/confetti.png')} alt="" />

            <header>
                <div className="filler"></div>
                <img src={FOOTBALL_IMAGE} alt="" />
                <div className="heading">
                    <p className="dialog-para main">Congratulations</p>
                    <p className="dialog-para">to the league winners</p>
                </div>
                <img src={FOOTBALL_IMAGE} alt="" />
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
      
  export default ConfirmationDialogWinners;