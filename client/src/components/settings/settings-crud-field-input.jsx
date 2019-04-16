import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

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

        const { name, value, disabled, label, fullWidth, multiline, blockType } = this.props;

        return (
            <TextField
                className={`${name}-input-field`}
                value={value}
                disabled={disabled}
                label={label}
                fullWidth={fullWidth}
                multiline={multiline}
                rows="5"
                id={name}
                onChange={this.handleChangeField}
                InputProps={blockType ? {                // blockType set to true will display the standard field type, false will set it to the Material UI type
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

// InputLabelProps={{
    //     shrink: true,
//     className: this.classes.bootstrapFormLabel,
// }}


FieldInput.defaultProps = {
    disabled: false,
    fullWidth: false,
    multiline: false,
    blockType: false,
}

FieldInput.propTypes = {
    classes: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    disabled: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    fullWidth: PropTypes.bool.isRequired,
    multiline: PropTypes.bool.isRequired,
    blockType: PropTypes.bool.isRequired,
    updateField: PropTypes.func.isRequired,
};

export default withStyles(styles)(FieldInput);
