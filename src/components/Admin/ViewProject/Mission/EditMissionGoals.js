import React, {Component} from 'react';
import {connect} from 'react-redux';
import EitherOr from './EitherOr';

class EditMissionGoals extends Component {

    state = {
        // Need to update this:
        mission_id: this.props.mission_id,
        goals: [],
    }

    componentDidUpdate(prevProps){
        console.log( `in componentDidUpdate, GoalList`, this.state );
        if( this.props.reduxState.missionDetails.goals !== prevProps.reduxState.missionDetails.goals ){
            this.setState({
                ...this.state, 
                goals: this.props.reduxState.missionDetails.goals,
            })
        }
    }

    handleGoal = (i, name) => (event) => {
        let newGoals = [...this.props.reduxState.missionDetails.goals];
        for( let goal of newGoals){
            if( goal.goal_id === i ){
                let index =  newGoals.indexOf( goal );
                console.log( `index:`, index, name );
                if(name === 'goal_type_id'){
                    newGoals[index][name] = Number(event.target.value);
                } else {
                    newGoals[index][name] = event.target.value;
                }
            }
        }
        this.props.dispatch( {type: 'UPDATE_GOALS', payload: newGoals} );
        this.setState({
            ...this.state, 
            goals: newGoals,
        })
    }

    addGoal = () => {
        this.props.dispatch( {type: 'ADD_GOAL_TO_MISSION', payload: this.state} );
        this.setState({ state: this.state });
        console.log(  );
        
    }

    removeGoal = (id) => () => {
        console.log( `in removeGoal`, id );
        let removePayload = { goal_id: id, mission_id: this.state.mission_id };
        this.props.dispatch( {type: 'DELETE_GOAL', payload: removePayload} );
        this.setState({ state: this.state });
    }

    render() {
        let missionDetails = this.props.reduxState.missionDetails;
        let goalList;
        let goalCount = 0;

        if( missionDetails.goals ){
            goalList = this.state.goals.map( goal => {
                let goalTypeForm;
                goalCount += 1;
                let goal_name = goal.goal_name;
                let points = goal.points;
                if(goal.goal_name === null){
                    goal_name = '';
                }
                if(goal.points === null){
                    points = '';
                }

                if( goal.goal_type_id === 1 ) {
                    goalTypeForm = <div>
                        <label>Name</label>
                        <input type="text" name="name" value={goal_name}
                            onChange={this.handleGoal(goal.goal_id, 'goal_name')} />
                        <label>Points</label>
                        <input type="number" name="points" value={points}
                            onChange={this.handleGoal(goal.goal_id, 'points')} />
                    </div>
                    
                } else if( goal.goal_type_id === 2 ) {
                    goalTypeForm = <EitherOr goal={goal.goal_id} mission_id={this.state.mission_id} />;

                } else if( goal.goal_type_id === 3 ) {
                    goalTypeForm = <div>
                        <label>Name</label>
                        <input type="text" name="name" value={goal.goal_name}
                            onChange={this.handleGoal(goal.goal_id, 'goal_name')} />
                        <label>Points</label>
                        <input type="number" name="points" value={goal.points}
                            onChange={this.handleGoal(goal.goal_id, 'points')} />
                        <br/>
                        <label>Min</label>
                        <input type="number" name="min" value={goal.how_many_min || 0}
                            onChange={this.handleGoal(goal.goal_id, 'how_many_min')} />
                        <label>Max</label>
                        <input type="number" name="max" value={goal.how_many_max || 1}
                            onChange={this.handleGoal(goal.goal_id, 'how_many_max')} />
                    </div>;
                }

                return <div key={goal.goal_id}>
                        <h3>Goal {goalCount}   &nbsp;  
                            <i onClick={this.removeGoal(goal.goal_id, goal)} className="fas fa-trash"></i>
                        </h3>
    
                        <label>Type </label>
                        <select name="goal_type_id" value={goal.goal_type_id}
                            onChange={this.handleGoal(goal.goal_id, 'goal_type_id')} >
                            <option value="" disabled >Choose a Type</option>
                            {this.props.reduxState.goalTypes.map( type => 
                                    <option key={type.id} value={type.id}>{type.type}</option>
                                )}
                        </select>
                        
                        {goalTypeForm}
                    </div>
            })
        }
    
        return(
            <div>
                {/* {JSON.stringify(this.state)} */}
                {goalList}
                <br/><br/>

                <button onClick={this.addGoal} >Add a Goal</button>
            </div>
        );
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});

export default connect(mapReduxStateToProps)(EditMissionGoals);