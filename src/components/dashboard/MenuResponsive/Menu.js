import React, { Component } from 'react';
import './Menu.css';
import RecordVoice from './RecordVoice/RecordVoice';
import Profile from './Profile/Profile';
import Notifications from './Notifications/Notifications';
import Home from './Home/Home';
import Search from './Search/Search';
import { connect } from "react-redux";
import { setMenu } from '../../../actions/menuActions';

class Menu extends Component { 

    constructor() {
        super();
        this.menuContentContainerRef = React.createRef();
        this.menuContentRef = React.createRef();
        this.state = {
            activeIcons: {
                // recordVoice: false,
                profile: false,
                notification: false,
                home: false,
                search: false
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
        let currentWindowHeight = window.innerHeight;
        this.menuContentRef.current.style.height = 'calc(' + currentWindowHeight + 'px - 80px)';
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
        this.menuContentContainerRef.current.style.zIndex = '2';
    }

    // Handle and stop windows scroll while menu items are open
    handleScroll = () => {
        this.menuContentContainerRef.current.style.zIndex = '3';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${window.scrollY}px`;
        // document.body.requestFullscreen();
    }

    goToSearchMenu = () => {
        this.props.history.push("/search");
    }

    goToHomeMenu = () => {
        this.props.history.push("/dashboard");
    }

    gotToRecordVoiceMenu = () => {
        this.props.history.push("/new-post");
    }

    gotToNotificationsMenu = () => {
        this.props.history.push("/notifications");
    }

    goToProfileMenu = () => {
        this.props.history.push("/profile/" + this.props.auth.user.id);
    }

    componentDidMount() {
        // this.setMenuIconActive(this.props.menuName);
        if (this.props.menuName) {
            if (this.props.menuName === 'profile') {
                const userId = window.location.href.split("/").pop();
                    if (userId === this.props.auth.user.id) {
                        this.setMenuIconActive(this.props.menuName);
                        this.props.setMenu(this.props.menuName);
                    } else {
                        this.setMenuIconActive(this.props.menu.currentMenu);
                    }
            } else {
                this.setMenuIconActive(this.props.menuName);
                this.props.setMenu(this.props.menuName);
            }
        } else {
            this.setMenuIconActive(this.props.menu.currentMenu);
        }
    }

    render () {
        return (
            <div className="responsive-menu-container" ref={this.menuContentContainerRef}>

                <div ref={this.menuContentRef} className="responsive-menu-content-display-container" >
                    {this.state.contentToDisplay}
                </div>

                <div className="responsive-menu-items-container">
                    <Home onClick={this.goToHomeMenu} isHomeActive={this.state.activeIcons.home} changeDisplayedContent={this.changeDisplayedContent} hideMenuItems={this.hideMenuItems} />
                    <Search onClick={this.goToSearchMenu} isSearchActive={this.state.activeIcons.search} changeDisplayedContent={this.changeDisplayedContent} />
                    {/* <RecordVoice onClick={this.gotToRecordVoiceMenu} isRecordVoiceActive={this.state.activeIcons.recordVoice}
                         changeDisplayedContent={this.changeDisplayedContent} /> */}
                    <Notifications onClick={this.gotToNotificationsMenu} isNotificationActive={this.state.activeIcons.notification} changeDisplayedContent={this.changeDisplayedContent} />

                    <Profile onClick={this.goToProfileMenu} isProfileActive={this.state.activeIcons.profile} changeDisplayedContent={this.changeDisplayedContent}
                         handleScroll={this.handleScroll} avatarImage={this.props.auth.user.avatarImage} />
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    menu: state.menu
});

export default connect(
    mapStateToProps,
    { setMenu }
  )(Menu);