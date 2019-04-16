import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
// import purple from '@material-ui/core/colors/purple';
// import { white } from 'ansi-colors';

const styles = theme => ({
    progress: {
        position: 'fixed',
        top: 'calc(50% - 125px)',
        left: 'calc(50% - 125px)',
        zIndex: 1,
        /* color: 'white', */
        margin: theme.spacing.unit * 2,
    },
});

function CircularIndeterminate(props) {
    const { classes } = props;
    return (
        <div className="loadingIndicator">
            <CircularProgress className={classes.progress} size={250} />
            {/* {/* <CircularProgress className={classes.progress} size={50} /> */}
            {/* <CircularProgress className={classes.progress} color="secondary" /> */}
            {/* <CircularProgress className={classes.progress} style={{ color: purple[500] }} thickness={7} /> */} */}
        </div>
    );
}


CircularIndeterminate.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CircularIndeterminate);
