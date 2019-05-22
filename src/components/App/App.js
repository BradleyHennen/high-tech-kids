import React, {Component} from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import {connect} from 'react-redux';

import ProtectedAdmin from '../ProtectedRoutes/ProtectedAdmin/ProtectedAdmin';
import ProtectedCoach from '../ProtectedRoutes/ProtectedCoach/ProtectedCoach';
import ProtectedTeams from '../ProtectedRoutes/ProtectedTeams/ProtectedTeams';
import ProtectedTeamWithAccess from '../ProtectedRoutes/ProtectedTeamWithAccess/ProtectedTeamWithAccess';

import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import AboutPage from '../AboutPage/AboutPage';
import UserPage from '../UserPage/UserPage';
import HomeAdmin from '../Admin/HomeAdmin/HomeAdmin';
import HomeTeam from '../CoachTeam/HomeTeam/HomeTeam';
import ViewProject from '../Admin/ViewProject/ViewProject';

import './App.css';
import ProtectedCoachAndTeams from '../ProtectedRoutes/ProtectedCoachAndTeams/ProtectedCoachAndTeams';

class App extends Component {
  componentDidMount() {
    this.props.dispatch({type: 'FETCH_USER'})
  }

  render() {
    return (
      <Router>
        <div>
          <Nav />
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/home" />
            {/* Visiting localhost:3000/about will show the about page.
            This is a route anyone can see, no login necessary */}
            <ProtectedAdmin
              exact
              path="/about"
              component={AboutPage}
            />
            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/home will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the 'Login' or 'Register' page.
            Even though it seems like they are different pages, the user is always on localhost:3000/home */}
            <ProtectedAdmin
              exact
              path="/home"
              component={UserPage}
            />
            <ProtectedAdmin
              exact
              path="/admin/home"
              component={HomeAdmin}
            />
            <ProtectedAdmin
              exact
              path="/admin/projects"
              component={ViewProject}
            />
            <ProtectedTeams
              exact
              path="/team/home"
              component={HomeTeam}
            />
            <Route render={() => <h1>404</h1>} />
          </Switch>
          <Footer />
        </div>
      </Router>
  )}
}

export default connect()(App);
