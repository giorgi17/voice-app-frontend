import React, { Component } from 'react';
import './ActivityCounter.css';

class ActivityCounter extends Component {
    
    constructor() {
        super();
        this.state = {
            userIdQueryParam: ''
        }
    }

    componentDidMount() {
        const userIdQueryParam = window.location.href.split("/").pop();
        this.setState({userIdQueryParam});
    }

    goToUserFollowers = () => {
        this.props.history.push(`/profile/${this.state.userIdQueryParam}/followers`);
    }

    goToUserFollowing = () => {
        this.props.history.push(`/profile/${this.state.userIdQueryParam}/following`);
    }

    render() {
        return (
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
        );
    }
};

export default ActivityCounter;