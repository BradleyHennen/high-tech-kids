import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';

const Nav = (props) => (
  <div className="nav">
    <Link to="/home">
      <h2 className="nav-title">High Tech Kids: Mission Control</h2>
    </Link>
    <br/>
    <div className="nav-right">

      <Link className={props.location.pathname === '/home' ? 'active nav-link' : 'nav-link'} to={"/home"}>
        {/* Show this link if they are logged in or not,
        but call this link 'Home' if they are logged in,
        and call this link 'Login / Register' if they are not */}
        {props.user.id ? 'Home' : 'Login / Register'}
      </Link>

      {/* COACH */}
      {props.user.security_clearance === 2 && (
        <>

          <Link className={props.location.pathname === '/missions' ? 'active nav-link' : 'nav-link'} to="/missions">
            View Missions
          </Link>

          <Link className={props.location.pathname === '/coach/teams' ? 'active nav-link' : 'nav-link'} to="/coach/teams">
            View Teams
          </Link>

          {/* <Link className={props.location.pathname === '/coach/create-team' ? 'active nav-link' : 'nav-link'} to="/coach/create-team">
            Make a Team
          </Link> */}

          {/* <Link className={props.location.pathname === '/practice-run' ? 'active nav-link' : 'nav-link'} to="/practice-run">
            Create Run
          </Link> */}
        </>
      )}

      {/* TEAM w/o access */}
      {props.user.security_clearance === 3 && (
        <>
          <Link className={props.location.pathname === '/missions' ? 'active nav-link' : 'nav-link'} to="/missions">
            View Missions
          </Link>

          <Link className={props.location.pathname === '/history' ? 'active nav-link' : 'nav-link'} to="/history">
            View Runs
          </Link>
        </>
      )}

      {/* TEAM W/access */}
      {props.user.security_clearance === 4 && (
        <>
          <Link className={props.location.pathname === '/missions' ? 'active nav-link' : 'nav-link'} to="/missions">
            View Missions
          </Link>

          <Link className={props.location.pathname === '/history' ? 'active nav-link' : 'nav-link'} to="/history">
            View Runs
          </Link>

          <Link className={props.location.pathname === '/practice-run' ? 'active nav-link' : 'nav-link'} to="/practice-run">
            Create Run
          </Link>
        </>
      )}

      {/* Show the link to the info page and the logout button if the user is logged in */}
      {props.user.id && (
        <>
          <LogOutButton className="nav-link"/>
        </>
      )}
      
      {/* Always show this link since the about page is not protected */}
      {/* <Link className="nav-link" to="/about">
        About
      </Link> */}
    </div>
  </div>
);

// Instead of taking everything from state, we just want the user
// object to determine if they are logged in
// if they are logged in, we show them a few more links 
// if you wanted you could write this code like this:
// const mapStateToProps = ({ user }) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(withRouter(Nav));
