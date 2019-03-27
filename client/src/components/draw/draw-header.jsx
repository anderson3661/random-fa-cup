import React, { Fragment, Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

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

                <div className="main-header">
                    <div className="image-left"><img src={FOOTBALL_IMAGE} alt="" /></div>
                    <h1>{displayHeader}</h1>
                    <div className="image-right"><img src={FOOTBALL_IMAGE} alt="" /></div>
                </div>

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

export default DrawHeader;