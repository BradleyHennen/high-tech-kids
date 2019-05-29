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

// Getting team members of logged in team
function* getTeamMembers(action) {
    try {
        const response = yield axios.get(`/api/teams/members`);
        yield put({ type: 'SET_TEAM_MEMBERS', payload: response.data });
    }
    catch (error) {
        console.log(`Couldn't get team members for logged in user.`, error);
        alert(`Sorry, couldn't get team members. Try again later.`);
    }
}

// Getting team members of logged in user
function* getTeamMembersWithId(action) {
    try {
        console.log('payload is', action.payload);
        
        const response = yield axios.get(`/api/teams/members/${action.payload}`);
        yield put({ type: 'SET_TEAM_MEMBERS', payload: response.data });
    }
    catch (error) {
        console.log(`Couldn't get team members for logged in user.`, error);
        alert(`Sorry, couldn't get team members. Try again later.`);
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

//Add team member to the team database
function* addTeamMember(action) {
    try {
        console.log(action.payload);
        yield axios.post( `/api/teams/team-member`, action.payload );        
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

//Get the team ID of the current team
function* getTeamId(action) {
    try {
        const response = yield axios.get(`/api/teams/team-id/${action.payload}`);
        console.log('response is', response.data);
        
        yield put({ type: 'SET_TEAM_ID', payload: response.data[0].id });
        yield put({type: 'GET_TEAM_MEMBERS_WITH_ID', payload: response.data[0].id})

    }
    catch(error) {
        console.log(`Couldn't get team ID`, error);
        alert(`Couldn't get team ID` )       
    }
}

function* teamSaga() {
    yield takeLatest( 'GET_ALL_TEAMS', getAllTeams );
    yield takeLatest( 'UPDATE_TEAM_ACCESS', updateTeamAccess );
    yield takeLatest( 'ADD_TEAM_MEMBER', addTeamMember );
    yield takeLatest( 'ADD_TEAM_NAME', addTeamName );
    yield takeLatest( 'GET_TEAM_MEMBERS', getTeamMembers );
    yield takeLatest( 'GET_TEAM_MEMBERS_WITH_ID', getTeamMembersWithId );
    yield takeLatest( 'GET_TEAM_ID', getTeamId)
}

export default teamSaga;