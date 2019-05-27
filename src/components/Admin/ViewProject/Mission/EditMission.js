import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import EitherOr from './EitherOr';

class EditMission extends Component {

    state = {
        mission_id: this.props.reduxState.projects.mission_id || 34,
        name: '',
        description: '',
        goalCount: 1,
        goals: [
            {
                goal: 1,
                type: '',
            }
        ]
    }

    componentDidMount(){
        this.props.dispatch( {type: 'GET_GOAL_TYPES'} );
        this.props.dispatch( {type: `GET_MISSION_DETAILS`, payload: this.state.mission_id} );
    }

    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value,
        })
        // console.log( `new state:`, this.state );
    }

    addGoal = () => {
        this.setState({
            ...this.state,
            goalCount: this.state.goalCount + 1,
            goals: [
                ...this.state.goals,
                {
                    goal: this.state.goalCount + 1,
                    type: '',
                }
            ]
        })
        // console.log( `Last state:`, this.state );
    }

    handleGoal = (i, name) => (event) => {
        // console.log( `State:`, this.state );
        let newGoals = [...this.state.goals];
        for( let goal of newGoals){
            if( goal.goal -1 === i ){
                let index =  newGoals.indexOf( goal );
                console.log( `index:`, index );
                newGoals[index][name] = event.target.value;
            }
        }

        this.setState({
            ...this.state,
            goals: newGoals,
        })
    }

    removeGoal = (i) => (event) => {
        event.preventDefault();
        // console.log( `ready to remove a goal:`, i );
        let newGoals = [...this.state.goals];

        for( let goal of newGoals){
            if( goal.goal -1 === i ){
                let index =  newGoals.indexOf( goal );
                console.log( `index:`, index );
                newGoals.splice(index, 1);
            }
        }

        this.setState({
            ...this.state,
            goalCount: this.state.goalCount -1,
            goals: newGoals,
        })
        // console.log( `New state:`, this.state.goals );
    }

    handleSave = () => {
        let eitherOrOptions = this.props.reduxState.goalOptions.optionList;
        let addMissionPayload = {
            mission: this.state,
            options: eitherOrOptions
        };

        this.props.dispatch( {type: 'ADD_MISSION', payload: addMissionPayload} );
        this.props.history.goBack();
    }

    render() {
        let goalList = 
            this.state.goals.map( (goal, index) => {
                index = goal.goal -1;
                let goalTypeForm;
                if( goal.type === '1' ){
                    goalTypeForm = <div>
                        <label>Name</label>
                        <input type="text" name="name" placeholder="Goal Name"
                            onChange={this.handleGoal(index, 'name')} />
                        <label>Points</label>
                        <input type="number" name="points" placeholder="0"
                            onChange={this.handleGoal(index, 'points')} />
                    </div>

                } else if( goal.type === '2' ){
                    goalTypeForm = <EitherOr index={index} goal={goal} />
                    
                } else if( goal.type === '3' ){
                    goalTypeForm = <div>
                        <label>Name</label>
                        <input type="text" name="name" placeholder="Goal Name"
                            onChange={this.handleGoal(index, 'name')} />
                        <label>Points</label>
                        <input type="number" name="points" placeholder="0"
                            onChange={this.handleGoal(index, 'points')} />
                        <br/>
                        <label>Min</label>
                        <input type="number" name="min" placeholder="0"
                            onChange={this.handleGoal(index, 'min')} />
                        <label>Max</label>
                        <input type="number" name="max" placeholder="0"
                            onChange={this.handleGoal(index, 'max')} />
                    </div>

                } else {
                    goalTypeForm = null;
                }

                return <div key={index}>
                    <h3>Goal {/* {goal.goal} */}   &nbsp;  
                        <i onClick={this.removeGoal(index)} className="fas fa-trash"></i>
                    </h3>

                    <label>Type </label>
                    <select name="type" value={goal.type}
                        onChange={this.handleGoal(index, 'type')} >
                        <option value="" disabled
                            selected >Choose a Type</option>
                        {this.props.reduxState.goalTypes.map( type => 
                                <option key={type.id} value={type.id}>{type.type}</option>
                            )}
                    </select>
                    
                    {goalTypeForm}
                </div>
            })
    
        return(
            <div>
                <h2>Edit Mission</h2>

                <label>Name</label>
                <input type="text" placeholder="Mission Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange} />
                <br/>
                <label>Description</label>
                <input type="text" placeholder="Mission Description"
                    name="description"
                    value={this.state.description}
                    onChange={this.handleChange} />
                <br/><br/>

                {goalList}
                <br/><br/>

                <button onClick={this.addGoal} >Add a Goal</button>
                <br/>
                <button onClick={this.handleSave} >Save Mission</button>

            </div>
        );
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});

export default connect(mapReduxStateToProps)(withRouter(EditMission));