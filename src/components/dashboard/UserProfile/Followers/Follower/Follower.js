import React, { Component } from 'react';
import './Follower.css';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import axios from 'axios';
import { Link } from 'react-router-dom';

class Follower extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.userPostModalCloseButtonRef = React.createRef();
        this.followButtonRef = React.createRef();
        this.state = {
            following: true
        }
    }

    // Fetch following information of certain user
    getFollowingInfo = () => {
        // Check if profile belongs to logged in user and if so, don't show follow button
        if (!this.props.user_id || 
            this.props.user_id === this.props.auth.user.id) {
                return;
        } 

        let dataToSend = {};

        dataToSend.user_id = this.props.user_id;

        // Send user id to determine wether he is following this user or not
        dataToSend.current_user_id = this.props.auth.user.id;

        axios.post("/api/restricted-users/get-user-following-data", dataToSend).then(response => {
            if (this._isMounted) { 
                this.setState({following: response.data.following});
                this.followButtonRef.current.style.display = 'block';
            }
        }).catch( err => {
            console.log(err);
        });
    }

    goToUserProfile = () => {
        this.props.history.push(`/profile/${this.props.user_id}`);
    }

    // Perform following or unfollowing on certain user
    followOrUnfollow = () => {
        let dataToSend = {};

        dataToSend.user_id = this.props.user_id;

        // Send logged in user id and username to follow or unfollow
        dataToSend.current_user_id = this.props.auth.user.id;
        dataToSend.current_user_name = this.props.auth.user.name;

        axios.post("/api/restricted-users/follow-or-unfollow", dataToSend).then(response => {
            if (this._isMounted) { 
                this.setState({following: response.data.following});
            }
        }).catch( err => {
            console.log(err);
        });
    }

    componentDidMount() {
        this._isMounted = true;
        this.getFollowingInfo(); 
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div className="single-follower">
                {/* <Link to={`/profile/${this.props.user_id}`}> */}
                    <img src={this.props.profile_img} onClick={this.goToUserProfile}></img>

                    <div className="single-follower-username">
                        <strong onClick={this.goToUserProfile}>{this.props.name}</strong>
                    </div>
                {/* </Link>    */}

                <div className="single-follower-follow-button" ref={this.followButtonRef}>
                    <Button variant="contained" 
                    color={`${this.state.following ? "secondary" : "primary"}`}
                    onClick={this.followOrUnfollow} >
                        {this.state.following ? 'Unfollow' : 'Follow'}
                    </Button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
  )(Follower);