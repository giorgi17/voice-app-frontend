import React, {Component} from 'react';
import './ProfileView.css';
import ProfileEdit from '../ProfileEdit/ProfileEdit';
import { connect } from "react-redux";
import axios from 'axios';
import UserActivityInfo from './UserActivityInfo/UserActivityInfo';

class ProfileView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userData: {
                name: null,
                avatarImage: null
            }
        }
    }

    componentDidMount() {
        // Fetch user data using id to be displayed in inputs
        axios.post('/api/restricted-users/get-user-data',
            {id: this.props.auth.user.id}).then(res => {
            this.setState({userData: { ...this.state.userData, ...res.data}});
        });
    }
    render() {
        return (
            <div className="profile-view-container">
                <div className="profile-view-image-wrapper">
                    <img src={this.state.userData.avatarImage} />
                </div>
    
                <strong className="profile-view-username">{this.state.userData.name}</strong>
    
                <div id="profile-view-edit-container" onClick={() => this.props.changeDisplayedContent(<ProfileEdit changeDisplayedContent={this.props.changeDisplayedContent} ></ProfileEdit>)}>
                    <span className="material-icons profile-view-edit">
                        edit
                    </span>
                </div>

                <UserActivityInfo></UserActivityInfo>
    
                <hr></hr>
                
    
            </div>
        );
    }
    
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
)(ProfileView);
