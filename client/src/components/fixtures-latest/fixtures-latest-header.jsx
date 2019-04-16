import React, { Fragment, Component } from "react";
import PropTypes from 'prop-types';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import { FOOTBALL_IMAGE, PAUSE_FIXTURES, PAUSE_PENALTIES, SEMI_FINALS, FINAL } from '../../utilities/constants';


class FixturesLatestHeader extends Component {

    handleClickStartSetOfFixtures = () => {
        this.props.onClickStartSetOfFixtures();
    }

    handleChangeFixtureUpdateInterval = (e) => {
        this.props.onChangeFixtureUpdateInterval(e.target.value);
    }

    handleChangeShowGoalUpdates = (e) => {
        this.props.onChangeShowGoalUpdates(e.target.checked);
    }

    render() {

        const { authenticated, hasCompetitionStarted, hasCompetitionFinished, competitionRound, displayHeader, startFixturesButtonText, startFixturesButtonEnabled,
                fixtureUpdateInterval, areFixturesInPlay, haveFixturesBeenPaused, showGoalUpdates } = this.props;

        return (

            <div className={`container-card latest-fixtures-header ${competitionRound === SEMI_FINALS || competitionRound === FINAL ? 'semis-or-final' : ''}`}>

                <div className="main-header">
                    {(hasCompetitionFinished || !hasCompetitionStarted) && <div className="image-left"><img src={FOOTBALL_IMAGE} alt="" /></div>}
                    <h1>{ displayHeader }</h1>
                    {(hasCompetitionFinished || !hasCompetitionStarted) && <div className="image-right"><img src={FOOTBALL_IMAGE} alt="" /></div>}
                </div>

                {hasCompetitionStarted && !hasCompetitionFinished &&
                    <Fragment>

                        <div className="fixture-update-button">
                            <Button
                                variant="contained"
                                color="primary"
                                id="startSetOfFixtures"
                                onClick={this.handleClickStartSetOfFixtures}
                                value={startFixturesButtonText}
                                disabled={!authenticated || !startFixturesButtonEnabled}
                                >{startFixturesButtonText}
                            </Button>
                        </div>

                        <div className="fixture-update-interval">
                            <TextField
                                id="fixtureUpdateInterval"
                                label="Fixture Update Interval (seconds)"
                                placeholder="e.g. 0.5"
                                className="form-control"
                                fullWidth
                                disabled={areFixturesInPlay && !haveFixturesBeenPaused && (startFixturesButtonText === PAUSE_FIXTURES || startFixturesButtonText === PAUSE_PENALTIES) }
                                value={fixtureUpdateInterval}
                                onChange={this.handleChangeFixtureUpdateInterval.bind(this)}
                            />
                        </div>

                        {competitionRound !== SEMI_FINALS && competitionRound !== FINAL &&
                            <div className="showGoalUpdates">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            className="showGoalsText"
                                            checked={showGoalUpdates}
                                            onChange={this.handleChangeShowGoalUpdates.bind(this)}
                                            value={showGoalUpdates.toString()}
                                        />
                                    }
                                    label="Show Goal Updates"
                                />                        
                            </div>
                        }

                    </Fragment>
                }

            </div>
            
        )
    }
}


FixturesLatestHeader.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    hasCompetitionStarted: PropTypes.bool.isRequired,
    hasCompetitionFinished: PropTypes.bool.isRequired,
    competitionRound: PropTypes.string.isRequired,
    displayHeader: PropTypes.string.isRequired,
    startFixturesButtonText: PropTypes.string.isRequired,
    startFixturesButtonEnabled: PropTypes.bool.isRequired,
    fixtureUpdateInterval: PropTypes.number.isRequired,
    areFixturesInPlay: PropTypes.bool.isRequired,
    haveFixturesBeenPaused: PropTypes.bool.isRequired,
    showGoalUpdates: PropTypes.bool.isRequired,
    onClickStartSetOfFixtures: PropTypes.func.isRequired,
    onChangeFixtureUpdateInterval: PropTypes.func.isRequired,
    onChangeShowGoalUpdates: PropTypes.func.isRequired,
}

export default FixturesLatestHeader;
