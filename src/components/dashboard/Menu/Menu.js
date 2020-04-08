import React, { Component } from 'react';
import './Menu.css';
import RecordVoice from './RecordVoice/RecordVoice';
import Profile from './Profile/Profile';
import Notifications from './Notifications/Notifications';

class Menu extends Component { 

    constructor() {
        super();
        this.state = {
            activeIcons: {
                recordVoice: false,
                profile: false,
                notification: false
            }
        };
      }    

    setMenuIconActive = (iconName) => {
        const stateCopy = {...this.state.activeIcons};
        for (var key in stateCopy) {
            if (stateCopy.hasOwnProperty(key)) {
                if (key === iconName) {
                    stateCopy[key] = true;
                } else {
                    stateCopy[key] = false;
                }
            }
        }
        this.setState({activeIcons: {...stateCopy}});
    }

    render () {
        return (
            <div className="menu-container">
                <div className="menu-items-container">
                    <RecordVoice onClick={this.setMenuIconActive} isRecordVoiceActive={this.state.activeIcons.recordVoice} />
                    <Profile onClick={this.setMenuIconActive} isProfileVoiceActive={this.state.activeIcons.profile} />
                    <Notifications onClick={this.setMenuIconActive} isNotificationVoiceActive={this.state.activeIcons.notification} />
                </div>
                <div className="menu-content-display-container" onClick={(e) => this.setMenuIconActive(e)}></div>
            </div>
        );
    }
}

export default Menu;