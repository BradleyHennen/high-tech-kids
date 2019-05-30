import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FaUndo } from 'react-icons/fa';

class RunScoring extends Component {

    state = {
        toggle: true,
        score: 0,
        runId: 0,
        goals: [],
        eitherOr: [],
        penalties: [],
        penaltyCount: 0,
    }

    componentDidUpdate(prevProps) {
        if (this.props.reduxState.runDetails !== prevProps.reduxState.runDetails) {
            this.setState({
                runId: this.props.reduxState.runDetails.id,
            })
        }
        if (this.props.reduxState.penalties !== prevProps.reduxState.penalties) {
            this.setState({
                penalties: this.props.reduxState.penalties,
            })
        }
        if (this.props.reduxState.selectedMissions !== prevProps.reduxState.selectedMissions) {
            this.setState({
                goals: this.props.reduxState.selectedMissions,
            })
        }
        if (this.props.reduxState.eitherOr !== prevProps.reduxState.eitherOr) {
            this.setState({
                eitherOr: this.props.reduxState.eitherOr,
            })
        }
    };

    missionList = (runInfo) => {
        // let missionArr = runInfo;
        let missionArr = this.state.goals;
        let eitherOrArr = this.state.eitherOr;
        let newMissionArr = [];
        let newEitherOrArr = [];
        let test = [];
        
        let newArr = [];

        //Find a way to stop loop other than #100
        for (let count = 0; count < 100; count++) {
            test = missionArr.filter(x => x.mission_id == count)

            if (test.length !== 0) {
                newMissionArr.push(test)
            }
        }
        console.log('newMissionsArr', newMissionArr);
        
        for (let count = 0; count < 100; count++) {
            test = eitherOrArr.filter(x => x.either_or_goal_id === count)

            if (test.length !== 0) {
                newEitherOrArr.push(test)
            }
        }
        console.log('newEitherOrArr', newEitherOrArr);
        return (
            newMissionArr.map((mission, i) => {
                return (
                    <div key={i}>
                        <h3>Mission {i + 1}: {mission[0].mission_name}</h3>
                        {mission.map(mission => {
                            return (
                                <div>
                                    {this.renderGoals(mission, newEitherOrArr)}
                                </div>
                            )
                        })}
                    </div>
                )
            })
        )
    }

    penaltyList = (penalties) => {
        return(
            penalties.map((penalty, i) => {
                console.log();
                
                return (
                    <div key={penalty.id}>
                        <button onClick={() => { this.penaltyOnClick(penalty, i) }} disabled={penalty.disabled}>{penalty.name}</button>
                        <button onClick={() => { this.undoOnClick(penalty) }}><FaUndo /></button>
                    </div>
                )  
            })
        )
    }

    renderGoals = (mission, eitherOr) => {
        if (mission.goal_type_id === 1) {
            return <button onClick={ () => { this.yesNoOnClick(mission) }}><div>{mission.goal_name}</div> <div>{mission.goal_points} pts</div></button>
        }
        else if (mission.goal_type_id === 2) {
            
            return (
                eitherOr.map((eithers, i) => {
                    return (
                        eithers.map( (either, i) => {
                            if (mission.goal_id == either.either_or_goal_id) {
                                return (
                                    <div>
                                        <button onClick={ () => { this.eitherOrOnClick(either) }}><div>{either.either_or_name}</div> <div>{either.either_or_points} pts</div></button>
                                        {this.renderOrText(eithers, i)}
                                    </div>
                                )
                            }
                        })
                    )
                })
            )
        }
        else if (mission.goal_type_id === 3) {

            return (
                <div>
                    <button onClick={() => { this.howManyOnClick(mission) }}><div>{mission.goal_name}</div><div>{mission.goal_points} pts each</div></button>
                </div>
            )
            }
        }

    renderOrText = (either, i) => {
        console.log('either length', either.length);
        if (i < (either.length - 1)) {
            return <h5>OR</h5>
        }
        return
    }

    penaltyOnClick = (penalty, i) => {
        let updatedPenalties = [...this.state.penalties];
        if (penalty.count < penalty.max && this.state.score >= penalty.points && penalty.disabled === false){
            penalty.count = penalty.count + 1
            console.log(`penalty.count is`, penalty.count);

        }
        else if (penalty.count === penalty.max ) {
            updatedPenalties[i].disabled = true;
            this.setState({
                penalties: updatedPenalties
            })
        }
        if( penalty.disabled === false && this.state.score >= penalty.points){
            this.setState({
                score: (this.state.score - penalty.points),
                penaltyCount: this.state.penaltyCount + 1,
            })
            // console.log(`this.state.penaltyCount`, this.state.penaltyCount);
        }
    }

    undoOnClick = ( penalty ) => {
        penalty.disabled = false; 
        if (penalty.count <= (penalty.max + 1) && penalty.count > 0) {
            penalty.count = penalty.count - 1
            console.log(`penalty.count is undooooo`, penalty.count);

            this.setState({
                score: (this.state.score + penalty.points),
                penaltyCount: this.state.penaltyCount - 1
            })
        }
    }

    // function to add points for how many goal type on click and disable button when max is reached
    howManyOnClick = ( goal ) => {
        goal.count = goal.count + 1;
        goal.isCompleted = true;
        if( goal.count <= goal.how_many_max ){
            this.setState({
                score: (this.state.score + goal.goal_points),
            })
        }
        else {
            goal.disabled = true;
        }
    // console.log(`how many goal`, goal);
    // console.log(`this.state.score`, this.state.score);

    }

    // function to add points for yes/no goal type on click and disable button after click
    yesNoOnClick = ( goal ) => {
        if (goal.disabled === false) {
            this.setState({
                score: (this.state.score + goal.goal_points),
            })
        }
        goal.isCompleted = true;
        goal.disabled = true;
        // console.log(`yes/no goal`, goal);
        // console.log(`this.state.score`, this.state.score);
    }

    // function to add points for either/or goal type on click and disable all options after click
    eitherOrOnClick = ( goal ) => {
        if( goal.disabled === false ){
            this.setState({
                score: (this.state.score + goal.either_or_points),
            })
        }
        for ( let item of this.state.eitherOr) {
            item.disabled = true;
        }
        for( let mission of this.state.goals ) {
            if (mission.goal_id === goal.either_or_goal_id){
                mission.isCompleted = true;
                // console.log(`either or goal`, mission);
            }
        }

        // console.log(`this.state.score`, this.state.score);
    }

    handleSubmit = () => {
        console.log(`final state`, this.state);
        this.props.dispatch({ type: 'UPDATE_RUN_DETAILS', payload: this.state });
    }

    render() {
        // console.log(`reduxState details in RunScoring`, this.state.selectedMissions);
        // console.log(`local state id in RunScoring`, this.state.runId);
        // console.log(`either/or in RunScoring`, this.state.eitherOr);
        // console.log(`penalties in RunScoring`, this.props.reduxState.penalties);
        
        return (
            
            <div>
                <h2>{this.props.reduxState.runDetails.name}</h2>
                <p>Score: {this.state.score}</p>
                {JSON.stringify(this.state.eitherOr)}
                {this.penaltyList(this.state.penalties)}
                {this.missionList(this.state.goals)}
                <button onClick={this.handleSubmit}>End Run</button>
            </div>
        )
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});

export default connect(mapReduxStateToProps)(RunScoring);