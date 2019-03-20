import React, { Component } from "react";
import Button from "@material-ui/core/Button";

import { FOOTBALL_IMAGE } from '../../utilities/constants';


class RouteToThisStage extends Component {

    shouldComponentUpdate(nextProps) {
        return true;
    }

    render() {

        const { fixturesForCompetition, teamName } = this.props;

        return (
            
            <div className="container-card route-to-this-stage">

                <header>
                    <div className="heading">Route to this stage</div>
                </header>

                <Button variant="contained" color="primary" id="close" onClick={() => this.props.onClose()}>Close</Button>

            </div>

        );
    }
}


export default RouteToThisStage;