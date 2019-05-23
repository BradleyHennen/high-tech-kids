import React, {Component} from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';

class EditPenalty extends Component {

    // TO DO!!! 
    // need to get penalty_id from Brad
    state = {
        // penalty_id source needs to change, or call it directly in componentDidMount/dispatch/payload
        penalty_id: this.props.reduxState.projects.id || 1,
        name: this.props.reduxState.penalty.name || '',
        description: this.props.reduxState.penalty.description || '',
        max: this.props.reduxState.penalty.max || '',
        points: this.props.reduxState.penalty.points || ''
    }

    componentDidMount(){
        this.props.dispatch( {type: 'GET_PENALTY', payload: this.state.penalty_id} );
    }

    handleChange = (event) => {
        this.setState({
            ...this.state,
            [event.target.name]: event.target.value,
        })
        console.log( `new state:`, this.state );
    }

    routeBack = () => {
        this.props.history.goBack();
    }

    updatePenalty = (event) => {
        event.preventDefault();

        let update = {...this.props.reduxState.penalty};
        console.log( update );

        let penaltyUpdate = {
            penalty_id: this.state.penalty_id || 1,
            name: this.state.name || update.name,
            description: this.state.description || update.description,
            max: this.state.max || update.max,
            points: this.state.points || update.points,
        };

        this.props.dispatch( {type: 'UPDATE_PENALTY', payload: penaltyUpdate} );
        this.props.history.goBack();
    }

    render() {
        const penalty = this.props.reduxState.penalty;

        return(
            <div>
                <h2>Edit Penalty</h2>

                <div>
                    <label>Name</label>
                    <input type="text" 
                        value={this.state.name || penalty.name}
                        name="name"
                        onChange={this.handleChange} />
                    <br/>

                    <label>Description</label>
                    <input type="text" 
                        name="description"
                        value={this.state.description || penalty.description}
                        onChange={this.handleChange} />
                    <br/><br/>
                    
                    <label>Max number of penalties</label>
                    <input type="number" 
                        name="max" min="1"
                        value={this.state.max || penalty.max}
                        onChange={this.handleChange} />
                    <br/>
                    
                    <label>Points</label>
                    <input type="number" 
                        name="points" max="-1"
                        value={this.state.points || penalty.points}
                        onChange={this.handleChange} />
                    <br/>
                </div>

                <button onClick={this.routeBack} >Back</button>
                <button onClick={this.updatePenalty} >Save Penalty</button>

            </div>
        );
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});

export default connect(mapReduxStateToProps)(withRouter(EditPenalty));