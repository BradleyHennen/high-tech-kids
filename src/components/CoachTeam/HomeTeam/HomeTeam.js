import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class HomeTeam extends Component {

  renderNewRunButton = () => {
    // if team has access to create their own runs
    if ( this.props.user.security_clearance === 4 ) {
      // return button for routing to start of new run view
      return (
        <Link to="/practice-run" ><button>Create New Run</button></Link>
      );
    }
  }

  render () {
    return (
        <div>
          <h2>Welcome { this.props.user.username } !</h2>
          {/* button to route to missions view */}
          <Link to="/missions" ><button>View Missions</button></Link>
          {/* button to route to run history view */}
          <Link to="/history" ><button>View Run History</button></Link>
          {/* conditionally render button based on user clearance level */}
          { this.renderNewRunButton() }
        </div>
		);
  }
}

const mapStateToProps = ({ user }) => ({ user });

export default connect( mapStateToProps )( HomeTeam );