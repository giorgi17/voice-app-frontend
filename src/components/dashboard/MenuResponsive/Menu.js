import React, { Component } from 'react';
import './Menu.css';
import RecordVoice from './RecordVoice/RecordVoice';
import Profile from './Profile/Profile';
import Notifications from './Notifications/Notifications';
import Home from './Home/Home';

class Menu extends Component { 

    constructor() {
        super();
        this.menuContentRef = React.createRef();
        this.state = {
            activeIcons: {
                recordVoice: false,
                profile: false,
                notification: false,
                home: true
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
        this.menuContentRef.current.style.height = 'calc(100vh - 80px)';
        this.setState({contentToDisplay: newContent});
    }

    hideMenuItems = () => {
        this.menuContentRef.current.style.height = 'auto';
        // Set position where scrolling was left off after closing menu items
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
        // document.exitFullscreen();
    }

    // Handle and stop windows scroll while menu items are open
    handleScroll = () => {
        document.body.style.position = 'fixed';
        document.body.style.top = `-${window.scrollY}px`;
        // document.body.requestFullscreen();
    }

    render () {
        return (
            <div className="responsive-menu-container">

                <div ref={this.menuContentRef} className="responsive-menu-content-display-container" >
                    {this.state.contentToDisplay}
                </div>

                <div className="responsive-menu-items-container">
                    <Home onClick={this.setMenuIconActive} isHomeActive={this.state.activeIcons.home} changeDisplayedContent={this.changeDisplayedContent} hideMenuItems={this.hideMenuItems} />
                    <RecordVoice onClick={this.setMenuIconActive} isRecordVoiceActive={this.state.activeIcons.recordVoice}
                         changeDisplayedContent={this.changeDisplayedContent} handleScroll={this.handleScroll} />
                    <Profile onClick={this.setMenuIconActive} isProfileActive={this.state.activeIcons.profile} changeDisplayedContent={this.changeDisplayedContent}
                         handleScroll={this.handleScroll} />
                    <Notifications onClick={this.setMenuIconActive} isNotificationActive={this.state.activeIcons.notification} changeDisplayedContent={this.changeDisplayedContent}
                         handleScroll={this.handleScroll} />
                </div>

            </div>
        );
    }
}

export default Menu;