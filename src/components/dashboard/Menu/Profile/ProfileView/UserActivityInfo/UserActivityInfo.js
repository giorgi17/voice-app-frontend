import React from 'react';

const UserActivityInfo = props => (
    <div className="profile-view-activity-info-wrapper">
        <div className="profile-view-activity-info">
            <h4>{props.postAuthorStatistics.posts}</h4>  <h6>POSTS</h6>
        </div>

        <div className="profile-view-activity-info">
            <h4>{props.postAuthorStatistics.followers}</h4>  <h6>FOLLOWERS</h6>
        </div>

        <div className="profile-view-activity-info">
            <h4>{props.postAuthorStatistics.following}</h4>  <h6>FOLLOWING</h6>
        </div>

        <div className="profile-view-activity-info">
            <h4>{props.postAuthorStatistics.likes}</h4>  <h6>LIKES</h6>
        </div>

        <div className="profile-view-activity-info">
            <h4>{props.postAuthorStatistics.dislikes}</h4>  <h6>DISLIKES</h6>
        </div>

        <div className="profile-view-activity-info">
            <h4>{props.postAuthorStatistics.comments}</h4>  <h6>COMMENTS</h6>
        </div>

        <div className="profile-view-activity-info">
            <h4>{props.postAuthorStatistics.views}</h4>  <h6>VIEWS</h6>
        </div>
    </div>
);

export default UserActivityInfo;