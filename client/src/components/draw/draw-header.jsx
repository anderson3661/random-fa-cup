import React, { Fragment, Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import PropTypes from 'prop-types';

import { FOOTBALL_IMAGE } from '../../utilities/constants';


class DrawHeader extends Component {

    handleStartDraw = () => {
        this.props.onClickStartDraw();
    }

    handleChangeDrawUpdateInterval = (e) => {
        this.props.onChangeDrawUpdateInterval(e.target.value);
    }

    render() {
    
        const { authenticated, isDrawInProgress, hasDrawBeenPaused, isDrawCompleted, displayHeader, startDrawButtonEnabled, startDrawButtonText, drawUpdateInterval } = this.props;

        return (

            <Fragment>

                <header>
                    <img src={FOOTBALL_IMAGE} alt="" />
                    <h1>{displayHeader}</h1>
                    <img src={FOOTBALL_IMAGE} alt="" />                        
                </header>

                {!isDrawCompleted &&
                    <div className="draw-control-section">

                        <div className="draw-update-button">
                            <Button
                                variant="contained"
                                color="primary"
                                id="startDraw"
                                onClick={this.handleStartDraw}
                                disabled={!authenticated || !startDrawButtonEnabled}
                                value={startDrawButtonText}
                                >{startDrawButtonText}
                            </Button>
                        </div>

                        <div className="draw-update-interval">
                            <TextField
                                id="drawUpdateInterval"
                                label="Draw Update Interval (seconds)"
                                placeholder="e.g. 0.5"
                                className="form-control"
                                fullWidth
                                disabled={isDrawInProgress && !hasDrawBeenPaused}
                                value={drawUpdateInterval}
                                onChange={this.handleChangeDrawUpdateInterval.bind(this)}
                            />
                        </div>

                    </div>
                }

            </Fragment>
        )
    }
}


DrawHeader.propTypes = {
    authenticated: PropTypes.bool.isRequired,
    isDrawInProgress: PropTypes.bool.isRequired,
    hasDrawBeenPaused: PropTypes.bool.isRequired,
    isDrawCompleted: PropTypes.bool.isRequired,
    displayHeader: PropTypes.string.isRequired,
    startDrawButtonEnabled: PropTypes.bool.isRequired,
    startDrawButtonText: PropTypes.string.isRequired,
    drawUpdateInterval: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),          // User could decide to blank this, in which case it will be a string (and not required)
    onClickStartDraw: PropTypes.func.isRequired,
    onChangeDrawUpdateInterval: PropTypes.func.isRequired,
}

export default DrawHeader;
