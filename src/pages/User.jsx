import React, {Component} from 'react'
import {Link} from 'react-router-dom'

export default class User extends Component{
    render(){
        return(
            <div>
                <Link to="/users">Back to Users</Link>
            </div>
        )
    }
}