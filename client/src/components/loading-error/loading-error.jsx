import React from "react";
import Button from "@material-ui/core/Button";
import { MAIN_BACKGROUND_IMAGE, FOOTBALL_IMAGE } from '../../utilities/constants';

import "./loading-error.scss";


const LoadingError = () => {

    return (

        <div className="outer-container-loading-error">
            <div className="container-main-content-loading-error">
                <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>
                <div className="container-card">
                    <header>
                        <img src={FOOTBALL_IMAGE} alt="" />
                        <h1>404 Error</h1>
                        <img src={FOOTBALL_IMAGE} alt="" />
                    </header>
                    <p>An error has been encountered loading this application</p>
                    <p>Please retry reloading the application</p>
                    <div className="buttons">
                        <Button variant="contained" color="primary" id="reloadApplication" onClick={() => { window.location.reload(); }}>Reload Application</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingError;