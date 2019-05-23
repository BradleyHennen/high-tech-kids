//Will allow us to create a new team

import React, { Component } from "react";
import { connect } from "react-redux";

const mapStateToProps = reduxState => ({
    reduxState
  });

  class AddTeam extends Component {

    state={
        newTeam: {
            teamName: '',
            teamNumber: '',
            password: '',
            teamMembers: []
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
            type: "ADD_TEAM_USER_INFO",
            payload: this.state.newTeam
        })
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
                        {/* {this.props.releasesReducer.map(item => 
                        ) */}
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

export default connect(mapStateToProps)(AddTeam);
