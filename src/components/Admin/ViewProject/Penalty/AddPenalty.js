import React, {Component} from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router-dom';

class AddPenalty extends Component {

    state = {
        project_id: this.props.reduxState.projects.id || 1,
        name: '',
        description: '',
        max: 1,
        points: -1
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

    savePenalty = (event) => {
        event.preventDefault();
        this.props.dispatch( {type: 'ADD_PENALTY', payload: this.state} );
        this.props.history.goBack();
    }

    render() {
        
        return(
            <div>
                <h2>Add Penalty</h2>

                <div>
                    <label>Name</label>
                    <input type="text" placeholder="Penalty Name"
                        name="name"
                        value={this.state.name}
                        onChange={this.handleChange} />
                    <br/>
                    <label>Description</label>
                    <input type="text" placeholder="Penalty Description"
                        name="description"
                        value={this.state.description}
                        onChange={this.handleChange} />
                    <br/><br/>
                    
                    <label>Max number of penalties</label>
                    <input type="number" placeholder="1" min="1"
                        name="max"
                        value={this.state.max}
                        onChange={this.handleChange} />
                    <br/>
                    <label>Points</label>
                    <input type="number" placeholder="-1" max="-1"
                        name="points"
                        value={this.state.points}
                        onChange={this.handleChange} />
                    <br/>
                </div>

                <button onClick={this.routeBack} >Back</button>
                <button onClick={this.savePenalty} >Save Penalty</button>

            </div>
        );
    }
}

const mapReduxStateToProps = (reduxState) => ({
    reduxState,
});

export default connect(mapReduxStateToProps)(withRouter(AddPenalty));