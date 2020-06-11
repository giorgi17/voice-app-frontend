import React from 'react';
import ProfileView from './ProfileView/ProfileView';

const Profile = (props) => {

    return (
        <div id="profile-container"
            className={`responsive-menu-item ${props.isProfileActive ? "active" : ""}`}
            onClick={() => {props.onClick();}}
            >
            {/* <span 
                className={`material-icons profile-icon ${props.isProfileActive ? "active" : ""}`}>
                account_box
            </span> */}
            <img src={props.avatarImage} className={`material-icons profile-icon ${props.isProfileActive ? "active" : ""}`} />
        </div>
    );
}

export default Profile;