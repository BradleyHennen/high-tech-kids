import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
        width: 350,
        height: 50,
    },
    // project: {
    //     maxWidth: "75%",
    //     minHeight: 500,
    //     textAlign: "left",
    //     display: "inline-block",
    //     padding: theme.spacing.unit,
    // }
})

// TODO add GET loop for project list

class ProjectSnap extends Component {

    componentDidMount = () => {

    }

    render() {
        const { classes } = this.props;

        return (
            
            <Paper className={classes.project}>
                <Typography variant="h4">Space, 2018-2019</Typography>
                <Typography variant="h6">The Project</Typography>
                <Typography variant="body1">The Project Challenge This Season Is To Identify A Human Problem...</Typography>
                <Typography variant="h6">The Robot Game</Typography>
                <Typography variant="body1">Robots have been built and programmed by teams using a Lego Mindstorm...</Typography>
                <Button variant="contained" color="primary">View Missions</Button>
            </Paper>
        )
    }
}

ProjectSnap.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProjectSnap);