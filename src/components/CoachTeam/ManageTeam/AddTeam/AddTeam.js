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
            
        },
        teamMembers: {
            teamMembers: []
        }
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
        this.props.dispatch({
            type: "ADD_TEAM_MEMBERS",
            payload: this.state.teamMembers
        })
        window.location = `#/coach/teams`
    }

    render(){
        return(
            <div>
                <h2>Add a Team</h2>
                <p>{JSON.stringify(this.state)}</p>
                <input type="text" onChange={this.handleChange("teamName")} value={this.state.newTeam.teamName} placeholder="Team Name"></input>
                <br />
                <input type="text" onChange={this.handleChange("teamNumber")} value={this.state.newTeam.teamNumber} placeholder="Team Number"></input>
                <br />
                <input type="text" onChange={this.handleChange("password")} value={this.state.newTeam.password} placeholder="Password"></input>
                <br />
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
                        <button>Add Teammate</button>
                    </tfoot>
                </table>
                <button onClick={this.saveTeam}>Save Team</button>
            </div>
        )
    }
}

export default connect(mapStateToProps)(AddTeam);
