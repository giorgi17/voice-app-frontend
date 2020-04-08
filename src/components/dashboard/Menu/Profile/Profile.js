import React from 'react';

const Profile = (props) => {
    return (
        <div id="profile-container"
            className={`menu-item ${props.isProfileVoiceActive ? "active" : ""}`}
            onClick={() => props.onClick("profile")}
            >
            <span 
                className={`material-icons profile-icon ${props.isProfileVoiceActive ? "active" : ""}`}>
                account_box
            </span>
        </div>
    );
}

export default Profile;