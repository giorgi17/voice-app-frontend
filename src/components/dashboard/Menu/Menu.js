import React from 'react';
import './Menu.css';
import RecordVoice from './RecordVoice/RecordVoice';
import Profile from './Profile/Profile';
import Notifications from './Notifications/Notifications';

const Menu = () => (
    <div className="menu-container">
        <div className="menu-items-container">
            <RecordVoice />
            <Profile />
            <Notifications />
        </div>
    </div>
);

export default Menu;