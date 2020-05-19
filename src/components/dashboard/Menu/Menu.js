import React, { Component } from 'react';
import './Menu.css';
import RecordVoice from './RecordVoice/RecordVoice';
import Profile from './Profile/Profile';
import Notifications from './Notifications/Notifications';
import RecordVoiceView from './RecordVoice/RecordVoiceView/RecordVoiceView';

class Menu extends Component { 

    constructor() {
        super();
        this.menuContentRef = React.createRef();
        this.menuMainWrapperRef = React.createRef();
        this.state = {
            activeIcons: {
                recordVoice: true,
                profile: false,
                notification: false
            },
            contentToDisplay: <RecordVoiceView />,
            makeMenuFixed: false
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

    scrollListener = e => {
        if (window.scrollY > 700) {
            this.setState({makeMenuFixed: true});
        } else {
            this.setState({makeMenuFixed: false});
        }
    }

    componentDidMount() {
        window.addEventListener("scroll", this.scrollListener);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.scrollListener);
    }

    render () {
        return (
            <div className={`menu-container ${this.state.makeMenuFixed ? "menu-container-fixed" : ""}`} ref={this.menuMainWrapperRef}>
                <div className="menu-items-container">
                    <RecordVoice onClick={this.setMenuIconActive} isRecordVoiceActive={this.state.activeIcons.recordVoice} changeDisplayedContent={this.changeDisplayedContent}/>
                    <Profile onClick={this.setMenuIconActive} isProfileActive={this.state.activeIcons.profile} changeDisplayedContent={this.changeDisplayedContent} />
                    <Notifications onClick={this.setMenuIconActive} isNotificationActive={this.state.activeIcons.notification} changeDisplayedContent={this.changeDisplayedContent} />
                </div>
                <div ref={this.menuContentRef} className="menu-content-display-container" >
                    {this.state.contentToDisplay}
                </div>
            </div>
        );
    }
}

export default Menu;