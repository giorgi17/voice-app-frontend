import React, {Component} from 'react';
import './ProfileView.css';
import ProfileEdit from '../ProfileEdit/ProfileEdit';
import { connect } from "react-redux";
import axios from 'axios';
import UserActivityInfo from './UserActivityInfo/UserActivityInfo';

class ProfileView extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            userData: {
                name: null,
                avatarImage: null
            },
            postAuthorStatistics: {
                posts: 0,
                followers: 0,
                following: 0,
                likes: 0,
                dislikes: 0,
                comments: 0,
                views: 0
            }
        }
    }

    // Fetch statistics for user
    getUserStatistics = () => {
        let dataToSend = {};
        dataToSend.user_id = this.props.auth.user.id;

        axios.post("/api/restricted-users/get-user-statistics", dataToSend).then(response => {
            if (this._isMounted) { 
                const postAuthorStatistics = {...this.state.postAuthorStatistics};
                postAuthorStatistics.posts = response.data.posts;
                postAuthorStatistics.followers = response.data.followers;
                postAuthorStatistics.following = response.data.following;
                postAuthorStatistics.likes = response.data.likes;
                postAuthorStatistics.dislikes = response.data.dislikes;
                postAuthorStatistics.comments = response.data.comments;
                postAuthorStatistics.views = response.data.views;
                this.setState({postAuthorStatistics});
                // console.log(response.data);
            } 
        }).catch( err => {
            console.log(err);
        });
    }

    componentDidMount() {
        this._isMounted = true;

        // Fetch user data using id to be displayed in inputs
        axios.post('/api/restricted-users/get-user-data',
            {id: this.props.auth.user.id}).then(res => {
                if (this._isMounted) {
                    this.setState({userData: { ...this.state.userData, ...res.data}});
                }
        });

        this.getUserStatistics();
    }

    componentWillUnmount() {
        this._isMounted = false;
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

                <UserActivityInfo postAuthorStatistics={this.state.postAuthorStatistics}></UserActivityInfo>
    
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
