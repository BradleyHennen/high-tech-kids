const selectedMissionsReducer = (state = [], action) => {
    switch (action.type) {
      case 'SET_SELECTED_MISSIONS':
        return action.payload;
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.user
  export default selectedMissionsReducer;