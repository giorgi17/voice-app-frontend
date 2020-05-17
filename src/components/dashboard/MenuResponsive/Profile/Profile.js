import React from 'react';
import ProfileView from './ProfileView/ProfileView';

const Profile = (props) => {

    return (
        <div id="profile-container"
            className={`responsive-menu-item ${props.isProfileActive ? "active" : ""}`}
            onClick={() => {props.onClick('profile'); props.changeDisplayedContent(<ProfileView changeDisplayedContent={props.changeDisplayedContent} ></ProfileView>);
                    props.handleScroll();}}
            >
            <span 
                className={`material-icons profile-icon ${props.isProfileActive ? "active" : ""}`}>
                account_box
            </span>
        </div>
    );
}

export default Profile;