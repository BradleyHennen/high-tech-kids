//Will allow us to create a new team

import React, { Component } from "react";
import { connect } from "react-redux";

const mapStateToProps = reduxState => ({
    reduxState
  });

  class AddTeam extends Component {

    render(){
        return(
            <div>
                <h2>Add a Team</h2>
                <input type="text" placeholder="Team Name"></input>
                <input type="text" placeholder="Team Number"></input>
                <input type="text" placeholder="Password"></input>
                <h3>Team Members</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>
                    <tfoot>
                        <button>Add Teammate</button>
                    </tfoot>
                </table>
                <button>Save Team</button>
            </div>
        )
    }
}

export default connect(mapStateToProps)(AddTeam);
