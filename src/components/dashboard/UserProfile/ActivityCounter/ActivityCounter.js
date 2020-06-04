import React, { Component } from 'react';
import './ActivityCounter.css';
import FollowersModal from '../Followers/Modal/Modal';
import FollowingModal from '../Followings/Modal/Modal';

class ActivityCounter extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.state = {
            userIdQueryParam: '',
            showFollowersModal: false,
            showFollowingModal: false
        }
    }

    goToUserFollowers = () => {
        if (this._isMounted) {
            if (window.innerWidth >= 600)
                this.setState({showFollowersModal: true});
            else
                this.props.history.push(`/profile/${this.state.userIdQueryParam}/followers`);
        }
            
        // this.props.history.push(`/profile/${this.state.userIdQueryParam}/followers`);
    }

    closeFollowersModal = () => {
        if (this._isMounted) 
            this.setState({showFollowersModal: false});
    }

    goToUserFollowing = () => {
        if (this._isMounted) {
            if (window.innerWidth >= 600)
                this.setState({showFollowingModal: true});
            else
                this.props.history.push(`/profile/${this.state.userIdQueryParam}/following`);
        }
    }

    closeFollowingModal = () => {
        if (this._isMounted) 
            this.setState({showFollowingModal: false});
    }

    componentDidUpdate() {
        const userIdQueryParam = window.location.href.split("/").pop();

        if (this.state.userIdQueryParam !== userIdQueryParam) {
            if (this._isMounted) 
                this.setState({userIdQueryParam, showFollowersModal: false,
                    showFollowingModal: false});
        }
    }

    componentDidMount() {
        this._isMounted = true;
        const userIdQueryParam = window.location.href.split("/").pop();
        if (this._isMounted) 
            this.setState({userIdQueryParam});
    }

    componentWillUnmount() {
        this._isMounted = false; 
    }

    render() {
        return (
                <React.Fragment>
                    <ul className="user-profile-page-basic-activity-info-wrapper">
                        <li>  
                            <strong>{this.props.userStatistics.posts}</strong> posts
                        </li>
                        <li onClick={this.goToUserFollowers}>
                            {/* <Link to={`/profile/${this.state.userIdQueryParam}/followers`}> */}
                                <strong>{this.props.userStatistics.followers}</strong> followers
                            {/* </Link> */}
                        </li>
                        <li onClick={this.goToUserFollowing}>
                            <strong>{this.props.userStatistics.following}</strong> following
                        </li>
                    </ul>

                    
                    <FollowersModal showFollowersModal={this.state.showFollowersModal}
                        closeFollowersModal={this.closeFollowersModal} history={this.props.history}/>

                    <FollowingModal showFollowingModal={this.state.showFollowingModal}
                        closeFollowingModal={this.closeFollowingModal} history={this.props.history}/>
               
                </React.Fragment>
        );
    }
};

export default ActivityCounter;