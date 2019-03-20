import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  bootstrapRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  bootstrapInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    // fontSize: 16,
    fontSize: 14,
    // padding: '10px 12px',
    padding: '0px 0px',
    textAlign: 'center',
    // width: 'calc(100% - 24px)',
    width: '100%',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  bootstrapFormLabel: {
    fontSize: 18,
  },
});


class FieldInput extends Component {

    constructor(props) {
        super(props);

        this.handleChangeField = this.handleChangeField.bind(this);
    }

    classes = this.props.classes;

    handleChangeField = event => { this.props.updateField(event.target.value); };

    render() {

        return (
            <TextField
                className={`${this.props.name}-input-field`}
                value={this.props.value}
                disabled={this.props.disabled}
                label={this.props.label}
                fullWidth={this.props.fullWidth}
                multiline={this.props.multiline}
                rows="5"
                id={this.props.name}
                onChange={this.handleChangeField}
                InputProps={this.props.blockType ? {                // blockType set to true will display the standard field type, false will set it to the Material UI type
                    disableUnderline: true,
                    classes: {
                        root: this.classes.bootstrapRoot,
                        input: this.classes.bootstrapInput
                    },
                } : {}}
            />
        );
    }
}


FieldInput.propTypes = {
  classes: PropTypes.object.isRequired,
};

// InputLabelProps={{
//     shrink: true,
//     className: this.classes.bootstrapFormLabel,
// }}

export default withStyles(styles)(FieldInput);