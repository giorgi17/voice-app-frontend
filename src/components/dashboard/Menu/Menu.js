import React, { Component } from 'react';
import './Menu.css';
import RecordVoice from './RecordVoice/RecordVoice';
import Profile from './Profile/Profile';
import Notifications from './Notifications/Notifications';

class Menu extends Component { 

    constructor() {
        super();
        this.menuContentRef = React.createRef();
        this.state = {
            activeIcons: {
                recordVoice: false,
                profile: false,
                notification: false
            },
            contentToDisplay: null
        };
      }    

    // Switching icon styles to "active" and displaying specific menu content on clicking icon
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

    changeDisplayedContent = (newContent) => {
        this.setState({contentToDisplay: newContent});
    }

    render () {
        return (
            <div className="menu-container">
                <div className="menu-items-container">
                    <RecordVoice onClick={this.setMenuIconActive} isRecordVoiceActive={this.state.activeIcons.recordVoice} />
                    <Profile onClick={this.setMenuIconActive} isProfileVoiceActive={this.state.activeIcons.profile} changeDisplayedContent={this.changeDisplayedContent} />
                    <Notifications onClick={this.setMenuIconActive} isNotificationVoiceActive={this.state.activeIcons.notification} changeDisplayedContent={this.changeDisplayedContent} />
                </div>
                <div ref={this.menuContentRef} className="menu-content-display-container" >
                    {this.state.contentToDisplay}
                </div>
            </div>
        );
    }
}

export default Menu;