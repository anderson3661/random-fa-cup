import React, { Component } from 'react';
import _ from 'lodash';

import FieldInput from './settings-crud-field-input';


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

    // componentWillReceiveProps(nextProps) {
    //     // This needed for when Populate Course is clicked, so that the values set on the parent are passed down to this child ??
    //     if (nextProps.value !== this.state.inputFieldValue) {
    //         this.setState({inputFieldValue: nextProps.value});
    //     }
    // }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        // Because the state values in this child component are updating the parent which will then re-render this child, there is no need to re-render this child in those circumstances
        return this.state.inputFieldValue !== nextState.inputFieldValue;
    }

    render() {

        return(
            <FieldInput
                name={this.props.name}
                label={this.props.label}
                value={this.state.inputFieldValue}
                disabled={this.props.disabled}
                fullWidth={this.props.fullWidth}
                multiline={this.props.multiline}
                blockType={this.props.blockType}
                updateField={this.handleChangeInputFieldValue}
            />
        )
    }
}

export default SettingsFieldInput;