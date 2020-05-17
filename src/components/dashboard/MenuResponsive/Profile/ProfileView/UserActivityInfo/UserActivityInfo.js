import React from 'react';
import './UserActivityInfo.css';

const UserActivityInfo = props => (
    <div className="responsive-profile-view-activity-info-wrapper">
        <div className="responsive-profile-view-activity-info">
            <h4>1</h4>  <h6>POSTS</h6>
        </div>

        <div className="responsive-profile-view-activity-info">
            <h4>17</h4>  <h6>FOLLOWERS</h6>
        </div>

        <div className="responsive-profile-view-activity-info">
            <h4>201</h4>  <h6>FOLLOWING</h6>
        </div>

        <div className="responsive-profile-view-activity-info">
            <h4>1340</h4>  <h6>LIKES</h6>
        </div>

        <div className="responsive-profile-view-activity-info">
            <h4>231</h4>  <h6>DISLIKES</h6>
        </div>

        <div className="responsive-profile-view-activity-info">
            <h4>193</h4>  <h6>COMMENTS</h6>
        </div>

        <div className="responsive-profile-view-activity-info">
            <h4>130,123</h4>  <h6>VIEWS</h6>
        </div>
    </div>
);

export default UserActivityInfo;