import React, { Component } from "react";
import { connect } from "react-redux";
import TeamMember from "./TeamMember";

class TeamMembers extends Component {
  state = {
    newTeam: {
      teamName: "",
      teamNumber: "",
      coach_user_id: this.props.reduxState.user.id,
      newTeamMember: "",
      teamId: ""
    }
  };

  componentDidMount() {
    this.getUrl();
  }

  changePage = () => {
    window.location = `#/coach/teams`;
  };

  handleChange = propertyName => event => {
    this.setState({
      newTeam: {
        ...this.state.newTeam,
        [propertyName]: event.target.value
      }
    });
  };

  addTeammate = () => {
    this.props.dispatch({
      type: "ADD_TEAM_MEMBER",
      payload: this.state.newTeam
    });
    this.setState({
        newTeam:{
            ...this.state.newTeam,
            newTeamMember: ""
        }
    })
  };

  //This will take the id from the url and use it to make a get request for the team members
  getUrl = () => {
    const keySplit = window.location.hash.split("=");
    const id = keySplit[1];
    this.setState({
      newTeam: {
        ...this.state.newTeam,
        teamId: id
      }
    });
    this.props.dispatch({
      type: "GET_TEAM_MEMBERS_WITH_ID",
      payload: id
    });
  };

  setId = () => {
    this.setState({
        newTeam: {
          ...this.state.newTeam,
          teamId: this.props.reduxState.teamInfoReducer[0].id
        }
      });
  }

  render() {
    if (this.props.reduxState.teamInfoReducer[0] === "State") {
      return <div />;
    } else
      return (
        <div>
          {JSON.stringify(this.state)}
          <h3>{this.props.reduxState.teamInfoReducer[0].name} Team Members</h3>
          <p>
            Team Number: {this.props.reduxState.teamInfoReducer[0].team_number}
          </p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {this.props.reduxState.teamMembersReducer.teamMembersReducer.map(
                item => (
                  <TeamMember item={item} key={item.id} />
                )
              )}
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <input
                    type="text"
                    onClick={this.setId}
                    onChange={this.handleChange("newTeamMember")}
                    value={this.state.newTeam.newTeamMember}
                    placeholder="New Team Member"
                  />
                </td>
                <td>
                  <button onClick={this.addTeammate}>Add Teammate</button>
                </td>
              </tr>
            </tfoot>
          </table>
          <button onClick={this.changePage}>Save</button>
        </div>
      );
  }
}
const mapReduxStateToProps = reduxState => ({
  reduxState
});
export default connect(mapReduxStateToProps)(TeamMembers);
