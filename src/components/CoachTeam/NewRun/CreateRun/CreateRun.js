import React, { Component } from 'react';
import { connect } from 'react-redux';
import SelectMissions from '../SelectMissions/SelectMissions';

class CreateRun extends Component {

    componentDidMount() {
        this.props.dispatch({ type: 'GET_ALL_MISSIONS' })
    }

    render () {
        return (
            <div>
                <SelectMissions />
            </div>
        )
    }
}


export default connect()( CreateRun );