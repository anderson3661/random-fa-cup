import React from 'react';
import PropTypes from 'prop-types';
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';

import ResultsByDivision from '../results-by-division/results-by-division';

import './dialogResultsByDivision.scss';

class DialogResultsByDivision extends React.Component {

    handleClose = () => {
      this.props.onClose();
    };
       
    render() {
      const { fixturesForCompetition, message, title, onClose, ...other } = this.props;
  
      return (
        <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
          {title && <DialogTitle className="dialog-title">{title}</DialogTitle>}
          <div className="dialog-para">
            <p>{message}</p>
          </div>
          <ResultsByDivision fixturesForCompetition={fixturesForCompetition} />
          <div className="dialog-button">
            <Button variant="contained" color="primary" id="dialogConfirm" onClick={this.handleClose}>OK</Button>
          </div>
        </Dialog>
      );
    }
}


DialogResultsByDivision.propTypes = {
    message: PropTypes.string.isRequired,
    title: PropTypes.string,                        // Not required as could be blank
    onClose: PropTypes.func.isRequired,
}

export default DialogResultsByDivision;
