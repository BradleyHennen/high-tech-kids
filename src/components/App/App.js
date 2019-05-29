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
import ProtectedRoute from '../ProtectedRoutes/ProtectedRoute/ProtectedRoute';

import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import AboutPage from '../AboutPage/AboutPage';
import UserPage from '../UserPage/UserPage';
import HomeAdmin from '../Admin/HomeAdmin/HomeAdmin';
import CreateRun from '../CoachTeam/NewRun/CreateRun/CreateRun';
import HomeTeam from '../CoachTeam/HomeTeam/HomeTeam';
import ViewProject from '../Admin/ViewProject/ViewProject';
import CoachHome from '../CoachTeam/HomeCoach/HomeCoach';
import ViewAllTeams from '../CoachTeam/ManageTeam/ViewAllTeams/ViewAllTeams';
import StartRun from '../CoachTeam/NewRun/StartRun/StartRun';
import ProjectOverview from '../CoachTeam/ProjectOverview/ProjectOverview';
import HomeCoach from '../CoachTeam/HomeCoach/HomeCoach';

import './App.css';
import ProtectedCoachAndTeams from '../ProtectedRoutes/ProtectedCoachAndTeams/ProtectedCoachAndTeams';
import AddPenalty from '../Admin/ViewProject/Penalty/AddPenalty';
import EditPenalty from '../Admin/ViewProject/Penalty/EditPenalty';
import AddMission from '../Admin/ViewProject/Mission/AddMission';
import EditMission from '../Admin/ViewProject/Mission/EditMission';

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
            {/* <ProtectedAdmin
              exact
              path="/about"
              component={AboutPage}
            /> */}
            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/home will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the 'Login' or 'Register' page.
            Even though it seems like they are different pages, the user is always on localhost:3000/home */}
            <ProtectedRoute
              exact
              path="/home"
              component={UserPage}
            />
            <ProtectedAdmin
              exact
              path="/admin/home"
              component={HomeAdmin}
            />
            <ProtectedCoachAndTeams
              exact 
              path="/practice-run"
              component={CreateRun}
            />
            <ProtectedCoachAndTeams
              exact
              path="/practice-run/run-scoring"
              component={StartRun}
            />
            <ProtectedAdmin
              exact
              path="/admin/projects"
              component={ViewProject}
            />
            <ProtectedAdmin
              // exact
              path="/admin/projects/add-penalty"
              component={AddPenalty}
            />
            <ProtectedAdmin
              // exact
              path="/admin/projects/edit-penalty"
              component={EditPenalty}
            />
            <ProtectedTeams
              exact
              path="/team/home"
              component={HomeTeam}
            />
            <ProtectedCoach
              exact
              path="/coach/teams"
              component={ViewAllTeams}
              />
            <ProtectedCoachAndTeams 
              exact
              path="/missions"
              component={ProjectOverview}
              />
            <ProtectedCoach
              exact
              path="/coach/home"
              component={HomeCoach}
            />
            <ProtectedAdmin
              // exact
              path="/admin/projects/add-mission"
              component={AddMission}
            />
            <ProtectedAdmin
              // exact
              path="/admin/projects/edit-mission"
              component={EditMission}
            />
            <Route render={() => <h1>404</h1>} />
          </Switch>
          <Footer />
        </div>
      </Router>
  )}
}

export default connect()(App);
