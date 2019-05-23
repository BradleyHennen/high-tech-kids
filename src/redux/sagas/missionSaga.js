import { takeLatest, put } from 'redux-saga/effects';
import axios from 'axios';

function* getMissions( action ) {    
    try {
        const response = yield axios.get(`/api/runs/missions`);
        console.log(`get response is`, response.data);
        yield put({ type: 'SET_ALL_MISSIONS', payload: response.data })
    }
    catch (error) {
        console.log(`Couldn't get missions from DB`);
    }
}

function* missionSaga() {
    yield takeLatest('GET_ALL_MISSIONS', getMissions);
}

export default missionSaga;