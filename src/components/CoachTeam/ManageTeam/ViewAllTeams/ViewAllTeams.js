import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import './ViewAllTeams.css';

class ViewAllTeams extends Component {

    componentDidMount(){
        // need the coach id to get their specific teams
        console.log( 'user id is:', this.props.reduxState );
        let coachId = this.props.reduxState.user.id;
        this.props.dispatch( { type: 'GET_ALL_TEAMS', payload: coachId } );
    }

    routeToAddTeam = () => {
        this.props.history.push('/coach/create-team');
    }

    // The following three routes are dependent on team's id
    // OR should we set these up as links and pass team_id as props?
    routeToCreateRun = (event) => {
        let team_id = event.target.value;
        this.props.history.push(`/practice-run/${team_id}`);
    }
    routeToTeamMembers = (event) => {
        let team_id = event.target.value;
        this.props.history.push(`/coach/${team_id}`);
    }
    routeToRunHistory = (event) => {
        let team_id = event.target.value;
        this.props.history.push(`/history/${team_id}`);
    }

    // dispatch for PUT request to update team_access
    changePermission = (event) => {
        console.log( `team_id:`, event.target.name );
        console.log( `access:`, event.target.value );
        
        let team_id = event.target.name;
        let access = event.target.value;
        let coachId = this.props.reduxState.user.id;
        let permissionObject = {team_id, permission: access, coachId};
        console.log( `permissionObject:`, permissionObject );
        
        this.props.dispatch( {type: 'UPDATE_TEAM_ACCESS', payload: permissionObject} );
    }

    render(){
        return(
            <div>
                <h2>Teams</h2>

                <button className="route-link" onClick={this.routeToAddTeam} >New Team</button>

                {/* map teams connected to coach's id and display as a card with button-links */}
                {this.props.reduxState.allTeams.map( team => 
                    <div className="team-card" key={team.id} >
                        <h3>{team.name}</h3>
                        <button className="route-link" 
                            onClick={this.routeToCreateRun}
                            value={team.id} >
                                Create New Run</button>
                        <br/>
                        <button className="route-link" 
                            onClick={this.routeToTeamMembers}
                            value={team.id} >
                                View Team Members</button>
                        <br/>
                        <button className="route-link" 
                            onClick={this.routeToRunHistory}
                            value={team.id} >
                                View Run History</button>
                        <br/>
                        
                        <div>
                            <p>Allow your team to create runs</p>
                            
                            {/* Toggle switch for team_access */}
                            <label className="switch">
                                <input type="checkbox" 
                                    onClick={this.changePermission}
                                    name={team.id} value={team.team_access}
                                    checked={team.team_access === true} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});

export default connect(mapReduxStateToProps)(withRouter(ViewAllTeams));