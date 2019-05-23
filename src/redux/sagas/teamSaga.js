import { takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';

// Getting coach's teams by the user id
function* getAllTeams(action) {
    try {
        console.log( action.payload );
        const response = yield axios.get( `/api/teams/${action.payload}` );
        yield put( {type: 'SET_ALL_TEAMS', payload: response.data} );
    }
    catch(error) {
        console.log(`Couldn't get teams by coach id.`, error);
        alert(`Sorry, couldn't get teams. Try again later.`);
    }
}

// Updating team_access between true/false
function* updateTeamAccess(action) {
    try {
        console.log( action.payload );
        yield axios.put( `/api/teams`, action.payload );
        yield put( {type: 'GET_ALL_TEAMS', payload: action.payload.coachId} );
    }
    catch(error) {
        console.log(`Couldn't update team access.`, error);
        alert(`Sorry, couldn't update team access. Try again later.`);
    }
}

//Add team members to the team database
function* addTeamMembers(action) {
    try {
        console.log(action.payload);
        yield axios.post( `/api/teams/team-members`, action.payload );
    }
    catch(error) {
        console.log(`Couldn't add team members`, error);
        alert(`Couldn't update team members`);
        
    }
}

//Add the team name to the database
function* addTeamName(action) {
    try {
        console.log(action.payload);
        yield axios.post( `/api/teams/team-name`, action.payload );
    }
    catch(error) {
        console.log(`Couldn't add team name`, error);
        alert(`Couldn't add team name`)       
    }
}

//Create the user info for the team
function* addTeamUserInfo(action) {
    try {
        console.log(action.payload);
        yield axios.post( `/api/teams/team-user`, action.payload );
    }
    catch(error) {
        console.log(`Couldn't add team user`, error);
        alert(`Couldn't add team user`)       
    }
}

function* teamSaga() {
    yield takeLatest( 'GET_ALL_TEAMS', getAllTeams );
    yield takeLatest( 'UPDATE_TEAM_ACCESS', updateTeamAccess );
    yield takeLatest( 'ADD_TEAM_MEMBERS', addTeamMembers );
    yield takeLatest( 'ADD_TEAM_NAME', addTeamName );
    yield takeLatest( 'ADD_TEAM_USER_INFO', addTeamUserInfo);
}

export default teamSaga;