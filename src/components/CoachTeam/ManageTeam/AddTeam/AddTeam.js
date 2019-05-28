//Will allow us to create a new team

import React, { Component } from "react";
import { connect } from "react-redux";
import TeamMember from './TeamMember'



  class AddTeam extends Component {

    state={
        newTeam: {
            teamName: '',
            teamNumber: '',
            password: '',
            coach_user_id: this.props.reduxState.user.id,
            newTeamMember: ''
        },
        teamSaved: false
    }

    componentDidMount(){
        this.props.dispatch( { type: 'GET_TEAM_MEMBERS_WITH_ID', payload: this.props.reduxState.user.id });
        this.setState({
            newTeam: {
                ...this.state.newTeam,
                teamId: this.props.reduxState.teamMembersReducer.team_id
            }
        })
    }

    handleChange = propertyName => event => {
        this.setState({
          newTeam: {
            ...this.state.newTeam,
            [propertyName]: event.target.value
          }
        });
      };

      //Dispatches team information and team members and pushes us to the view all teams page
    saveTeam = () => {
        this.props.dispatch({
            type: "ADD_TEAM_NAME",
            payload: this.state.newTeam
        })
        this.setState({
            teamSaved: true
        })
        // this.props.dispatch({
        //     type: "ADD_TEAM_MEMBERS",
        //     payload: this.state.newTeam
        // })
        // window.location = `#/coach/teams`
    }

    addTeammate = () => {

    }

    render(){
        console.log(this.props);
        
        if (this.state.teamSaved === false){
        return(
            <div>
                <h2>Add a Team</h2>
                <p>{JSON.stringify(this.state)}</p>
                <label>Team Name</label>
                <input type="text" onChange={this.handleChange("teamName")} value={this.state.newTeam.teamName} placeholder="Team Name"></input>
                <br />
                <label>Team Number</label>
                <input type="text" onChange={this.handleChange("teamNumber")} value={this.state.newTeam.teamNumber} placeholder="Team Number"></input>
                <br />
                <label>Password</label>
                <input type="text" onChange={this.handleChange("password")} value={this.state.newTeam.password} placeholder="Password"></input>
                <br />
                <button onClick={this.saveTeam}>Save Team</button>
                </div>
                )}
        else return(
            <div>
                <h3>Team Members</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.props.reduxState.teamMembersReducer.map(item => 
                        (<TeamMember item={item} key={item.id}/>)
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                        <td><input type="text" placeholder="New Team Member"></input></td>
                        <td><button onClick={this.addTeammate}>Add Teammate</button></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        )
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});export default connect(mapReduxStateToProps)(AddTeam);
