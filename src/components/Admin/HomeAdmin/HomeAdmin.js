import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import ProjectSnap from './ProjectSnap/ProjectSnap'
import './HomeAdmin.css'

const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
      width: 350,
      height: 50,
    },
    root: {
        flexGrow: 1,
    }
  })

// TODO add GET loop for project list

class HomeAdmin extends Component {
    
    componentDidMount = () =>{

    }

  render() {
    const { classes } = this.props;
    
    return (
        <div className={classes.root}>
            <Grid container spacing={24} direction="column" justify="center" alignItems="center">
                <Grid item xs={12}>
                    <Typography variant="h1">Welcome!</Typography>
                    <Typography variant="body1">Click on a project to view details or create a new project below.</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Paper className="projects">
                        <Typography variant="h3">Projects</Typography>
                        <Button className={classes.button} variant="contained" color="primary">New Projects</Button>
                        <Button className={classes.button} variant="contained" color="primary">Space</Button>
                        <Button className={classes.button} variant="contained" color="primary">Water</Button>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <ProjectSnap/>
                </Grid>
            </Grid>
        </div>

  )}
}

HomeAdmin.propTypes = {
    classes: PropTypes.object,
  };

export default withStyles(styles)(HomeAdmin);