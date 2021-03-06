import React, { Component, Fragment } from "react";
import PropTypes from 'prop-types';

import { SEASON, FIXTURE_UPDATE_INTERVAL, BASE_FOR_RANDOM_MULTIPLIER, AWAY_TEAM_FACTOR, IS_NOT_A_TOP_TEAM_FACTOR, DIVISION_FACTOR, GOALS_PER_MINUTE_FACTOR, IS_IT_A_GOAL_FACTOR, IS_IT_A_GOAL_PENALTY_FACTOR } from '../../utilities/constants';

import SettingsFieldInput from './settings-field-input';
import * as helpers from '../../utilities/helper-functions/helpers';
import { haveSettingsFactorsValuesChanged, haveSettingsFactorsValidationErrorValuesChanged } from './settings-helpers';


class SettingsFactors extends Component {

    // <span>For help, click on the Help link at the bottom of the screen</span>

    handleChangeSettingsFactorsFields = (objectKey) => this.props.onChangeSettingsFactorsFields(objectKey);

    shouldComponentUpdate(nextProps) {
        return helpers.hasObjectValueChanged(this.props, nextProps, 'hasCompetitionStarted') ||
               helpers.hasObjectValueChanged(this.props, nextProps, 'hasCompetitionFinished') ||
               haveSettingsFactorsValuesChanged(this.props.settingsFactors, nextProps.settingsFactors) ||
               haveSettingsFactorsValidationErrorValuesChanged(this.props.settingsFactorsValidationErrors, nextProps.settingsFactorsValidationErrors);
    }

    render() {
        const { hasCompetitionStarted, hasCompetitionFinished, settingsFactors, settingsFactorsValidationErrors } = this.props;

        return (
            
            <Fragment>

                <div className="container-card">
                    <h2>Competition Information</h2>

                    <div className="grid-season-info competition-information">

                        <div className="fullWidth">
                            <SettingsFieldInput
                                name={SEASON}
                                label="Season"
                                value={settingsFactors[SEASON]}
                                disabled={hasCompetitionStarted}
                                onChangeInputFieldValue={this.handleChangeSettingsFactorsFields(SEASON)}
                            />
                        </div>
                        {settingsFactorsValidationErrors[SEASON] && <div className="validation-error">{settingsFactorsValidationErrors[SEASON]}</div>}

                        {/* <div className="fullWidth">
                            <SettingsFieldInput
                                name={COMPETITION_START_DATE}
                                label="Competition Start Date"
                                placeholder="e.g. 05 Aug 2017"
                                value={settingsFactors[COMPETITION_START_DATE]}
                                disabled={hasCompetitionStarted}
                                onChangeInputFieldValue={this.handleChangeSettingsFactorsFields(COMPETITION_START_DATE)}
                            />
                        </div>
                        {settingsFactorsValidationErrors[COMPETITION_START_DATE] && <div className="validation-error">{settingsFactorsValidationErrors[COMPETITION_START_DATE]}</div>} */}

                    </div>

                </div>

                <div className="container-card">
                    <h2>Match Score Factors</h2>

                    <div className="grid-season-info match-score-factors">

                        <div className="fullWidth">
                            <SettingsFieldInput
                                name={FIXTURE_UPDATE_INTERVAL}
                                label="Fixture Update Interval (seconds)"
                                placeholder="e.g. 0.5"
                                value={settingsFactors[FIXTURE_UPDATE_INTERVAL]}
                                disabled={hasCompetitionFinished}
                                onChangeInputFieldValue={this.handleChangeSettingsFactorsFields(FIXTURE_UPDATE_INTERVAL)}
                            />
                        </div>
                        {settingsFactorsValidationErrors[FIXTURE_UPDATE_INTERVAL] && <div className="validation-error">{settingsFactorsValidationErrors[FIXTURE_UPDATE_INTERVAL]}</div>}

                        <div className="fullWidth">
                            <SettingsFieldInput
                                name={BASE_FOR_RANDOM_MULTIPLIER}
                                label="Base For Random Multiplier"
                                placeholder="e.g. 90"
                                value={settingsFactors[BASE_FOR_RANDOM_MULTIPLIER]}
                                disabled={hasCompetitionFinished}
                                onChangeInputFieldValue={this.handleChangeSettingsFactorsFields(BASE_FOR_RANDOM_MULTIPLIER)}
                            />
                        </div>
                        {settingsFactorsValidationErrors[BASE_FOR_RANDOM_MULTIPLIER] && <div className="validation-error">{settingsFactorsValidationErrors[BASE_FOR_RANDOM_MULTIPLIER]}</div>}

                        <div className="fullWidth">
                            <SettingsFieldInput
                                name={AWAY_TEAM_FACTOR}
                                label="Away Team Factor"
                                placeholder="e.g. 1.1"
                                value={settingsFactors[AWAY_TEAM_FACTOR]}
                                disabled={hasCompetitionFinished}
                                onChangeInputFieldValue={this.handleChangeSettingsFactorsFields(AWAY_TEAM_FACTOR)}
                            />
                        </div>
                        {settingsFactorsValidationErrors[AWAY_TEAM_FACTOR] && <div className="validation-error">{settingsFactorsValidationErrors[AWAY_TEAM_FACTOR]}</div>}

                        <div className="fullWidth">
                            <SettingsFieldInput
                                name={IS_NOT_A_TOP_TEAM_FACTOR}
                                label="Is Not A Top Team Factor"
                                placeholder="e.g. 1.1"
                                value={settingsFactors[IS_NOT_A_TOP_TEAM_FACTOR]}
                                disabled={hasCompetitionFinished}
                                onChangeInputFieldValue={this.handleChangeSettingsFactorsFields(IS_NOT_A_TOP_TEAM_FACTOR)}
                            />
                        </div>
                        {settingsFactorsValidationErrors[IS_NOT_A_TOP_TEAM_FACTOR] && <div className="validation-error">{settingsFactorsValidationErrors[IS_NOT_A_TOP_TEAM_FACTOR]}</div>}

                        <div className="fullWidth">
                            <SettingsFieldInput
                                name={DIVISION_FACTOR}
                                label="Division Factor"
                                placeholder="e.g. 1.1"
                                value={settingsFactors[DIVISION_FACTOR]}
                                disabled={hasCompetitionFinished}
                                onChangeInputFieldValue={this.handleChangeSettingsFactorsFields(DIVISION_FACTOR)}
                            />
                        </div>
                        {settingsFactorsValidationErrors[DIVISION_FACTOR] && <div className="validation-error">{settingsFactorsValidationErrors[DIVISION_FACTOR]}</div>}

                        <div className="fullWidth">
                            <SettingsFieldInput
                                name={IS_IT_A_GOAL_FACTOR}
                                label="Is It A Goal Factor"
                                placeholder="e.g. 2"
                                value={settingsFactors[IS_IT_A_GOAL_FACTOR]}
                                disabled={hasCompetitionFinished}
                                onChangeInputFieldValue={this.handleChangeSettingsFactorsFields(IS_IT_A_GOAL_FACTOR)}
                            />
                        </div>
                        {settingsFactorsValidationErrors[IS_IT_A_GOAL_FACTOR] && <div className="validation-error">{settingsFactorsValidationErrors[IS_IT_A_GOAL_FACTOR]}</div>}

                        <div className="fullWidth">
                            <SettingsFieldInput
                                name={IS_IT_A_GOAL_PENALTY_FACTOR}
                                label="Is It A Goal Factor (Penalty)"
                                placeholder="e.g. 80"
                                value={settingsFactors[IS_IT_A_GOAL_PENALTY_FACTOR]}
                                disabled={hasCompetitionFinished}
                                onChangeInputFieldValue={this.handleChangeSettingsFactorsFields(IS_IT_A_GOAL_PENALTY_FACTOR)}
                            />
                        </div>
                        {settingsFactorsValidationErrors[IS_IT_A_GOAL_PENALTY_FACTOR] && <div className="validation-error">{settingsFactorsValidationErrors[IS_IT_A_GOAL_PENALTY_FACTOR]}</div>}

                        <div className="fullWidth">
                            <SettingsFieldInput
                                name={GOALS_PER_MINUTE_FACTOR}
                                label="Goals Per Minute Factor"
                                placeholder="e.g. [{'minutes': 30, 'factor': 1.8}, {'minutes': 80, 'factor': 1.2}, {'minutes': 120, 'factor': 1}]"
                                fullWidth={true}
                                value={settingsFactors[GOALS_PER_MINUTE_FACTOR]}
                                disabled={hasCompetitionFinished}
                                onChangeInputFieldValue={this.handleChangeSettingsFactorsFields(GOALS_PER_MINUTE_FACTOR)}
                            />
                        </div>
                        {settingsFactorsValidationErrors[GOALS_PER_MINUTE_FACTOR] && <div className="validation-error">{settingsFactorsValidationErrors[GOALS_PER_MINUTE_FACTOR]}</div>}

                    </div>
                </div>

            </Fragment>
        );
    }
}


SettingsFactors.propTypes = {
    hasCompetitionStarted: PropTypes.bool.isRequired,
    hasCompetitionFinished: PropTypes.bool.isRequired,
    settingsFactors: PropTypes.object.isRequired,
    settingsFactorsValidationErrors: PropTypes.object.isRequired,
    onChangeSettingsFactorsFields: PropTypes.func.isRequired,
}

export default SettingsFactors;
