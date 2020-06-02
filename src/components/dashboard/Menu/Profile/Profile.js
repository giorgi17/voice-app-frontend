import React, { Component } from 'react';
import './Profile.css';
import ProfileView from './ProfileView/ProfileView';
import { connect } from "react-redux";
import axios from 'axios';

class Profile extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = {
            profilePicture: ''
        }
    }

    fetchUserProfilePicture = () => {
        let dataToSend = {};

        // Send id of the notification author to fetch his profile picture
        dataToSend.id = this.props.auth.user.id;

        axios.post("/api/restricted-users/get-user-profile-picture-for-notifications", dataToSend).then(response => {
            if (this._isMounted) {
                this.setState({profilePicture: response.data.avatarImage});
            }
        }).catch( err => {
            console.log(err.message);
        });
    }   

    componentDidMount() {
        this._isMounted = true;
        this.fetchUserProfilePicture();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div id="profile-container"
                className={`menu-item ${this.props.isProfileActive ? "active" : ""}`}
                onClick={() => {this.props.onClick(); 
                    // this.props.changeDisplayedContent(<ProfileView changeDisplayedContent={this.props.changeDisplayedContent} ></ProfileView>)
                }
                }
                >
                <img src={this.state.profilePicture}
                    className={`material-icons profile-icon ${this.props.isProfileActive ? "active" : ""}`}>
                    
                </img>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
  )(Profile);