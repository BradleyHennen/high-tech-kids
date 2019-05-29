import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
// import EitherOr from './EitherOr';
import EditMissionGoals from './EditMissionGoals';

class EditMission extends Component {

    state = {
        // need to fix alternate form of getting mission_id
        mission_id: 34,
        name: '',
        description: '',
        goals: []
    }

    componentDidMount(){
        this.props.dispatch( {type: 'GET_GOAL_TYPES'} );
        this.props.dispatch( {type: `GET_MISSION_DETAILS`, payload: this.state.mission_id} );
    }

    componentDidUpdate(prevProps){
        if( this.props.reduxState.missionDetails !== prevProps.reduxState.missionDetails ){
            this.setState({
                ...this.state, 
                name: this.props.reduxState.missionDetails.name,
                description: this.props.reduxState.missionDetails.description,
                goals: this.props.reduxState.missionDetails.goals,
            })
        }
    }

    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value,
        })
        console.log( `new state:`, this.state );
    }

    handleSave = () => {
        let missionDetails = this.props.reduxState.missionDetails;

        let missionUpdate = {
            // need to fix alternate form of getting mission_id
            mission_id: this.state.mission_id || missionDetails.mission_id,
            name: this.state.name || missionDetails.name,
            description: this.state.description || missionDetails.description,
            goals: missionDetails.goals,
            eitherOrOptions: this.props.reduxState.goalOptions.optionList,
        }

        this.props.dispatch( {type: 'UPDATE_MISSION', payload: missionUpdate} );
        // this.props.history.goBack();
    }

    render() {
        let missionDetails = this.props.reduxState.missionDetails;
        let missionIntro;

        if(missionDetails){
            missionIntro = <div>
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
            </div>
        } else {
            missionIntro = null;
        }
    
        return(
            <div>
                <h2>Edit Mission</h2>

                {missionIntro}
                <br/><br/>

                <EditMissionGoals mission_id={this.state.mission_id} />
                <br/><br/>
                <button onClick={this.handleSave} >Save Mission</button>

            </div>
        );
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});

export default connect(mapReduxStateToProps)(withRouter(EditMission));