import { takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';


function* getAllProjects(action) {
    try {
        const response = yield axios.get(`/api/projects`);
        yield put({ type: 'SET_PROJECTS', payload: response.data })
    }
    catch (error) {
        console.log(`Couldn't get project info`);
    }
}

function* getProjectDetails(action) {
    console.log('action.payload', action.payload.projectId);
    
    try {
        const response = yield axios.get(`/api/projects/${action.payload.projectId}`);
        yield put({ type: 'SET_PROJECT_DETAILS', payload: response.data })
    }
    catch (error) {
        console.log(`Couldn't get project info`);
    }
}

function* getPenalties(action) {
    try {
        const response = yield axios.get(`/api/projects/penalties/${action.payload.projectId}`);
        yield put({ type: 'SET_PENALTIES', payload: response.data })
    }
    catch (error) {
        console.log(`Couldn't get penalties info`);
    }
}

function* getMissions(action) {
    try {
        const response = yield axios.get(`/api/projects/missions/${action.payload.projectId}`);
        yield put({ type: 'SET_MISSIONS', payload: response.data })
    }
    catch (error) {
        console.log(`Couldn't get penalties info`);
    }
}

function* getEitherOr(action) {
    try {
        const response = yield axios.get(`/api/projects/missions/either-or/${action.payload.projectId}`);
        yield put({ type: 'SET_EITHER_OR', payload: response.data })
    }
    catch (error) {
        console.log(`Couldn't get either/or goals info`);
    }
}

function* addProject(action) {
    try {
        const response = yield axios.post(`/api/projects`, action.payload);
        console.log('new project id:', response);
        
        yield put({ type: 'GET_ALL_PROJECTS' })
    }
    catch (error) {
        console.log(`Couldn't get project info`);
    }
}

function* projectSaga() {
    yield takeLatest('GET_ALL_PROJECTS', getAllProjects);
    yield takeLatest('GET_PROJECT_DETAILS', getProjectDetails);
    yield takeLatest('GET_PENALTIES', getPenalties);
    yield takeLatest('GET_MISSIONS', getMissions);
    yield takeLatest('GET_EITHER_OR', getEitherOr);
    yield takeLatest('ADD_PROJECT', addProject);
}

export default projectSaga;