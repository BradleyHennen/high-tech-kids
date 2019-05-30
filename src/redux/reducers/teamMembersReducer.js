import { combineReducers } from 'redux';


// Holding all teams by specific coach_user_id
const teamMembersReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_TEAM_MEMBERS':
            return action.payload;

        default:
            return state;
    }
};


//Gets the team ID after a team is created to be able to assign it to new members
const teamIdReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_TEAM_ID':
        console.log(action.payload);
        
            return action.payload;

        default:
            return state;
    }
}



export default combineReducers({
    teamMembersReducer,
    teamIdReducer,
})