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
            newTeamMember: '',
            teamId: ''
        },
        teamSaved: false
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
            teamSaved: true,
        })

    }

    setId = () => {
        this.setState({
            newTeam: {
                ...this.state.newTeam,
                teamId: this.props.reduxState.teamMembersReducer.teamIdReducer
            }
        })
    }
    

    addTeammate = () => {
        this.props.dispatch({
            type: "ADD_TEAM_MEMBER",
            payload: this.state.newTeam
        })
    }
  

    changePage = () => {
        window.location = `#/coach/teams`

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
                <p>{JSON.stringify(this.state)}</p>

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.props.reduxState.teamMembersReducer.teamMembersReducer.map(item => 
                        (<TeamMember item={item} key={item.id}/>)
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                        <td><input type="text" onClick={this.setId} onChange={this.handleChange("newTeamMember")} value={this.state.newTeamMember} placeholder="New Team Member"></input></td>
                        <td><button onClick={this.addTeammate}>Add Teammate</button></td>
                        </tr>
                    </tfoot>
                </table>
                <button onClick={this.changePage}>Save</button>

            </div>
        )
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});export default connect(mapReduxStateToProps)(AddTeam);
