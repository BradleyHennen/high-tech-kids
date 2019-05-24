import React, { Component } from "react";
import {connect} from 'react-redux';

class TeamMember extends Component {
//Takes in team members as props
  render() {
    return (
        <tr>
        <td>{this.props.item.name}</td>
      </tr>
    );
  }
}

const mapStateToProps = ({ user }) => ({ user });

export default connect(mapStateToProps)(TeamMember);