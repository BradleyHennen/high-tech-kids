import React, {Component} from 'react';
import {connect} from 'react-redux';

class EitherOr extends Component {

    state = {
        mission_id: this.props.mission_id,
        goal_id: this.props.goal,
        optionArray: [],
        optionCount: 0,
        count: 1,
    }

    componentDidMount() {
        this.props.dispatch( {type: 'GET_GOAL_TYPES'} );

        if( this.props.editState === false ){
            this.props.dispatch( {type: 'ADD_STARTER_OPTIONS', payload: this.props.goal} );
        }
    }

    componentDidUpdate(prevProps){
        console.log( `in componentDidUpdate, E/O`, this.state );
        if( this.props.reduxState.goalOptions.optionList !== prevProps.reduxState.goalOptions.optionList ){
            this.setState({
                optionArray: this.props.reduxState.goalOptions.optionList,
                optionCount: this.props.reduxState.goalOptions.optionCount,
            })
        }
        if( this.props.reduxState.missionDetails !== prevProps.reduxState.missionDetails ){
            this.setState({ state: this.state });
        }
    }

    addOption = () => {
        if(this.props.editState === false){
            console.log( `In AddMission` );
            this.props.dispatch( {type: 'ADD_OPTION', payload: this.state} );
            
        } else {
            console.log( `In EditMission` );
            this.props.dispatch( {type: 'ADD_OPTION_TO_GOAL', payload: this.state} );
        }
        
        // need to update state in order to update the mapping of goalOptionReducer
        this.setState({ state: this.state });
    }

    handleOption = (i, name) => (event) => {
        let newOptions = [...this.props.reduxState.goalOptions.optionList];

        for( let option of newOptions){
            if( option.id === i ){
                let index =  newOptions.indexOf( option );
                console.log( `index:`, index );
                newOptions[index][name] = event.target.value;
                newOptions[index].goal_id = this.props.goal;
            }
        }

        this.props.dispatch( {type: 'SET_GOAL_OPTIONS', payload: newOptions} );
        // need to update state in order to update the mapping of missionDetails.goals
        this.setState({ state: this.state });
    }

    removeOption = (i) => (event) => {
        event.preventDefault();
        if(this.props.editState === false){
            let newOptions = [...this.props.reduxState.goalOptions.optionList];

            for( let option of newOptions){
                if( option.id === i ){
                    let index =  newOptions.indexOf( option );
                    console.log( `index:`, index );
                    newOptions.splice(index, 1);
                }
            }

            this.props.dispatch( {type: 'REMOVE_OPTION', payload: newOptions} );
        } else {
            let removeOptionPayload = {
                option_id: i,
                mission_id: this.state.mission_id,
            }
            console.log( `in delete option:`, removeOptionPayload );

            this.props.dispatch( {type: 'DELETE_OPTION', payload: removeOptionPayload} );
        }

        // need to update state in order to update the mapping of goalOptionReducer
        this.setState({ state: this.state });
    }

    render() {
        let optionArray = this.props.reduxState.goalOptions.optionList;
        let optionCount = this.props.reduxState.goalOptions.optionCount;
        let optionMap;
        // let optionNum = 0;

        if(optionCount > 1){
            optionMap = optionArray.map( option => {
                // optionNum += 1;
                console.log( `in goal options:`, option.goal_id );

                let option_name = option.option_name;
                let option_points = option.option_points;
                if(option.option_name === null){
                    option_name = '';
                }
                if(option.option_points === null){
                    option_points = '';
                }

                if( option.goal_id === this.props.goal ){
                    return <div key={option.id} >
                        <label>Option </label>
                        <input type="text" name="option_name" placeholder="Option Name"
                            value={option_name}
                            onChange={this.handleOption(option.id, 'option_name')} />
                        <label>Points</label>
                        <input type="number" name="option_points" placeholder="0"
                            value={option_points}
                            onChange={this.handleOption(option.id, 'option_points')} />
                        <i onClick={this.removeOption(option.id)} className="fas fa-trash"></i>
                        </div>
                } else {
                    return null;
                }
            }
        )} else {
            optionMap = null;
        }

        return(
            <div>
                {/* {JSON.stringify(this.state)} */}
                {optionMap}

                <button onClick={this.addOption} >Add Option</button>

            </div>
        )
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});

export default connect(mapReduxStateToProps)(EitherOr);