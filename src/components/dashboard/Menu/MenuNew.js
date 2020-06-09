import React, { Component } from 'react';
import './MenuNew.css';
import RecordVoice from './RecordVoice/RecordVoice';
import Profile from './Profile/Profile';
import Notifications from './Notifications/Notifications';
import RecordVoiceView from './RecordVoice/RecordVoiceView/RecordVoiceView';
import Home from './Home/Home';
import { connect } from "react-redux";
import { setMenu } from '../../../actions/menuActions';

class MenuNew extends Component { 

    constructor() {
        super();
        this.menuContentRef = React.createRef();
        this.menuMainWrapperRef = React.createRef();
        this.state = {
            contentToDisplay: null,
            activeIcons: {
                // recordVoice: true,
                profile: false,
                notification: false,
                home: true
            },
            previousActiveIcon: 'home',
            makeMenuFixed: false
        };
      }    

    // Switching icon styles to "active" and displaying specific menu content on clicking icon
    setMenuIconActive = (iconName) => {
        const stateCopy = {...this.state.activeIcons};

        // Getting currently active icon
        let previousActiveIcon = this.state.previousActiveIcon;
 
        Object.keys(stateCopy).forEach((icon, index) => {
            if (this.state.activeIcons[icon] && icon !== 'notification') {
                previousActiveIcon = icon;
            }
        });

        // Setting new icon active
        for (var key in stateCopy) {
            if (stateCopy.hasOwnProperty(key)) {
                if (key === iconName) {
                    stateCopy[key] = true;
                } else {
                    stateCopy[key] = false;
                }
            }
        }
        this.setState({activeIcons: {...stateCopy}, previousActiveIcon});
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

    goToHomeMenu = () => {
        this.props.history.push("/dashboard");
    }

    goToProfileMenu = () => {
        this.props.history.push("/profile/" + this.props.auth.user.id);
    }

    componentDidMount() {
        // window.addEventListener("scroll", this.scrollListener);
        if (this.props.menuName) {
            if (this.props.menuName === 'profile') {
                const userId = window.location.href.split("/").pop();
                    if (userId === this.props.auth.user.id) {
                        this.setMenuIconActive(this.props.menuName);
                        this.props.setMenu(this.props.menuName);
                    }
            } else {
                this.setMenuIconActive(this.props.menuName);
                this.props.setMenu(this.props.menuName);
            }
        } else {
            this.setMenuIconActive(this.props.menu.currentMenu);
        }
    }

    componentWillUnmount() {
        // window.removeEventListener("scroll", this.scrollListener);
    }

    render () {
        return (
            <React.Fragment>
                <div className={`menu-container ${this.state.makeMenuFixed ? "menu-container-fixed" : ""}`} ref={this.menuMainWrapperRef}>
                        <Home onClick={this.goToHomeMenu} isHomeActive={this.state.activeIcons.home} />
                        {/* <RecordVoice onClick={this.setMenuIconActive} isRecordVoiceActive={this.state.activeIcons.recordVoice} changeDisplayedContent={this.changeDisplayedContent}/> */}
                        <Notifications onClick={this.setMenuIconActive} isNotificationActive={this.state.activeIcons.notification} changeDisplayedContent={this.changeDisplayedContent}
                            previousActiveIcon={this.state.previousActiveIcon} />
                        <Profile onClick={this.goToProfileMenu} isProfileActive={this.state.activeIcons.profile} changeDisplayedContent={this.changeDisplayedContent} />

                        {this.state.contentToDisplay}
                </div>
                
                {/* {this.state.contentToDisplay} */}
            </React.Fragment>
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
  )(MenuNew);