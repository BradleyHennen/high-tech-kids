import React, { Component } from "react";
import {connect} from 'react-redux';

class TeamMember extends Component {

state = {
  edit: false,
  teamMemberName: this.props.item.name,
  id: this.props.item.member_id,
  teamId: this.props.reduxState.teamMembersReducer.teamIdReducer
}


handleChange = propertyName => event => {
  this.setState({
      ...this.state,
      [propertyName]: event.target.value
    })
  }



  editTeamMember = () => {
    this.setState({
      ...this.state,
      edit: true,
    })
  }

  saveTeamMember = () => {
    this.setState({
      ...this.state,
      edit: false
    })
    this.props.dispatch({
      type: "EDIT_TEAM_MEMBER",
      payload: this.state
    })
  }

//Takes in team members as props
  render() {
    if (this.state.edit === false)
    return (
        <tr>
        <td>{this.props.item.name}</td>
        <td><button onClick={this.editTeamMember}>Edit</button></td>
      </tr>
    );
    else if (this.state.edit === true) 
    return (
      <tr>
        <td><input value={this.state.teamMemberName} onChange={this.handleChange("teamMemberName")}></input></td>
        <td><button  onClick={this.saveTeamMember}>Save</button></td>
      </tr>
    )
  }
}


const mapReduxStateToProps = (reduxState) => ({
  reduxState,
});export default connect(mapReduxStateToProps)(TeamMember);