import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import FieldInput from './settings-crud-field-input';
import { TESTING_MODE } from '../../utilities/constants';


class SettingsFieldInput extends Component {
    // It uses lodash debounce so that it isn't updating state on every key press

    constructor(props) {
        super(props);

        this.state = {
            inputFieldValue: props.value
        }

        this.handleChangeInputFieldValue = this.handleChangeInputFieldValue.bind(this);
        this.updateInputFieldValue = _.debounce(this.updateInputFieldValue, 500);
    }

    handleChangeInputFieldValue = inputFieldValue => {
        this.setState({ inputFieldValue: inputFieldValue });
        this.updateInputFieldValue(inputFieldValue);
    }

    updateInputFieldValue = inputFieldValue => {
        this.props.onChangeInputFieldValue(inputFieldValue);
    };

    componentWillReceiveProps(nextProps) {
        // This needed for when Reset App is clicked, so that the values set on the parent are passed down to this child
        if (nextProps.value !== this.state.inputFieldValue) {
            this.setState({inputFieldValue: nextProps.value});
        }
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        // Because the state values in this child component are updating the parent which will then re-render this child, there is no need to re-render this child in those circumstances
        return this.state.inputFieldValue !== nextState.inputFieldValue;
    }

    render() {
        if (TESTING_MODE) console.log('render settings-field-input');

        const { inputFieldValue } = this.state;
        const { name, disabled, label, fullWidth, multiline, blockType } = this.props;

        return(
            <FieldInput
                name={name}
                label={label}
                value={inputFieldValue}
                disabled={disabled}
                fullWidth={fullWidth}
                multiline={multiline}
                blockType={blockType}
                updateField={this.handleChangeInputFieldValue}
            />
        )
    }
}


SettingsFieldInput.defaultProps = {
    disabled: false,
    fullWidth: false,
    multiline: false,
    blockType: false,
}

SettingsFieldInput.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    disabled: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    fullWidth: PropTypes.bool.isRequired,
    multiline: PropTypes.bool.isRequired,
    blockType: PropTypes.bool.isRequired,
    onChangeInputFieldValue: PropTypes.func.isRequired,
}

export default SettingsFieldInput;
