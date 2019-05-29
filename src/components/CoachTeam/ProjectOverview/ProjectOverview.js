import React, { Component } from 'react';
import { connect } from 'react-redux';
import qs from 'query-string';

class ProjectOverview extends Component {

    state = {
        projectId: 0,
        editProject: false,
        projectName: '',
        projectDetails: {},
        projectPenalties: [],
        projectMissions: [],
        projectEitherOr: [],
    }

    componentDidMount() {
        this.props.dispatch({ type: 'GET_ALL_PROJECTS'})
        this.props.dispatch({ type: 'GET_PROJECT_DETAILS', payload: this.state });
        this.props.dispatch({ type: 'GET_PENALTIES', payload: this.state });
        this.props.dispatch({ type: 'GET_MISSIONS', payload: this.state });
        this.props.dispatch({ type: 'GET_EITHER_OR', payload: this.state });
    }

    componentDidUpdate(prevProps) {
        if (this.state.projectDetails == 0) {
            this.props.dispatch({ type: 'GET_PROJECT_DETAILS', payload: this.state });
            this.props.dispatch({ type: 'GET_PENALTIES', payload: this.state });
            this.props.dispatch({ type: 'GET_MISSIONS', payload: this.state });
            this.props.dispatch({ type: 'GET_EITHER_OR', payload: this.state });
        }
        if (this.props.reduxState.projects !== prevProps.reduxState.projects) {
            this.setState({
                projectId: this.props.reduxState.projects[0].id
            })
        };
        if (this.props.reduxState.projectDetails !== prevProps.reduxState.projectDetails) {            
            this.setState({
                projectId: this.props.reduxState.projects[0].id,
                projectName: this.props.reduxState.projectDetails.name,
                projectDetails: this.props.reduxState.projectDetails
            })

        };
        if (this.props.reduxState.penalties !== prevProps.reduxState.penalties) {
            this.setState({
                projectPenalties: this.props.reduxState.penalties
            })
        };
        if (this.props.reduxState.projectMission !== prevProps.reduxState.projectMission) {
            this.setState({
                projectMissions: this.props.reduxState.projectMission
            })
        };
        if (this.props.reduxState.eitherOr !== prevProps.reduxState.eitherOr) {
            this.setState({
                projectEitherOr: this.props.reduxState.eitherOr
            })
        };
    }

    groundControl = () => {
        let missionArr = this.state.projectMissions;
        let newArr = [];
        let test = [];

        //Find a way to stop loop other than #100
        for (let count = 0; count < 100; count++) {
            test = missionArr.filter(x => x.mission_id == count)

            if (test.length !== 0) {

                newArr.push(test)
            }
        }
        return (
            newArr.map((mission, i) => {
                return (
                    <div key={i}>
                        <h3>Mission {i + 1}: {mission[0].mission_name}</h3>
                        <h4>{mission[0].description}</h4>
                        {mission.map((mission, i) => {
                            return (
                                <div key={i}>
                                    {this.renderGoals(mission)}
                                </div>
                            )
                        })}
                    </div>
                )
            })
        )
    }

    renderGoals = (mission) => {
        if (mission.goal_type_id === 1) {
            return <h5>Goal: {mission.name} = {mission.points} points</h5>
        }
        else if (mission.goal_type_id === 2) {
            return (
                this.state.projectEitherOr.map((either, i) => {
                    if (mission.goal_id == either.goal_id) {
                        return (
                            <div key={i}>
                                <h5>Goal: {either.name} = {either.points} points</h5>
                                {this.renderOrText(either)}
                            </div>
                        )
                    }
                })
            )
        }
        else if (mission.goal_type_id === 3) {

            return (
                <div>
                    <h5>Goal: {mission.name} = {mission.points} points each</h5>
                    <h6></h6>
                </div>
            )
        }
    }
    //-----TODO-----
    //finish OR render to DOM
    renderOrText = (either) => {
        // console.log('either length', either);
        return <h5>OR</h5>
    }

    render() {
        return (
            <div>
                <h1>{this.state.projectDetails.name}: {this.state.projectDetails.year}</h1>
                <h2>The Project:</h2>
                <p>{this.state.projectDetails.description}</p>
                
                <div>
                    <h2>Missions</h2>
                    <hr />
                    {this.groundControl()}
                </div>
                <div>
                    <h2>Penalties</h2>
                    <hr />
                    {this.state.projectPenalties.map(penalty => {
                        return (
                            <div key={penalty.id}>
                                <h3>{penalty.name}</h3>
                                <p>Description: {penalty.description}</p>
                                <p>Max Penalties: {penalty.max}</p>
                                <p>Points: {penalty.points}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = reduxState => ({
    reduxState
});

export default connect(mapStateToProps)(ProjectOverview);