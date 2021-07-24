import React, {Component} from 'react';
import NotificationsView from './NotificationsView/NotificationsView';
import { connect } from "react-redux";
import axios from 'axios';

class Notifications extends Component {
    _isMounted = false;

    constructor() {
        super();
        this.iconContainerRef = React.createRef();
        this.state = {
            notification: null,
            notificationPanelOpen: false
        }
    }

    toggleHandler = () => {
        if (this.state.notificationPanelOpen) {
            console.log("No it's not");
            this.setState({notificationPanelOpen: false});
            this.props.onClick(this.props.previousActiveIcon);
            this.props.changeDisplayedContent(null);
        } else {
            this.setState({notificationPanelOpen: true});
            this.props.onClick("notification");
            this.setState({notification: 0}); 
            this.props.changeDisplayedContent(<NotificationsView changeDisplayedContent={this.props.changeDisplayedContent} 
                previousActiveIcon={this.props.previousActiveIcon} onClick={this.props.onClick}
                notificationPanelClose={this.notificationPanelClose}
                iconContainerRef={this.iconContainerRef}></NotificationsView>);
        }
    }

    notificationPanelClose = () => {
        this.setState({notificationPanelOpen: false});
    }

    componentDidMount() {
        this._isMounted = true;

        let dataToSend = {};

        // Send user id to fetch notifications
        dataToSend.user_id = this.props.auth.user.id;

        axios.post("http://localhost:8888/api/restricted-users/get-notification-number-data", dataToSend).then(response => {
            if (this._isMounted) {
                this.setState({notification: response.data.notification});
            }
        }).catch( err => {
            console.log(err);
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
            // TODO: Check if there are any notifications with redux 

        let notificationsIcon = (
        // <span className={`material-icons notifications-icon ${this.props.isNotificationActive ? "active" : ""}`}>
                                 <span className={`notifications-icon ${this.props.isNotificationActive ? "material-icons" : "material-icons-outlined"}`} >
                                    notifications
                                </span>);
        if (this.state.notification && this.state.notification > 0) {
  
            notificationsIcon = (<div className="material-label mdl-badge" data-badge={this.state.notification}>
                                    <span className={`notifications-icon ${this.props.isNotificationActive ? "material-icons" : "material-icons-outlined"}`} >
                                    {/* <span className={`material-icons notifications-icon ${this.props.isNotificationActive ? "active" : ""}`}> */}
                                        notifications
                                    </span>
                                </div>);
        }

        return (
            <div id="notifications-container" ref={this.iconContainerRef}
                className={`menu-item ${this.props.isNotificationActive ? "active" : ""}`}
                onClick={
                    this.toggleHandler
                    // () => {this.props.onClick("notification"); this.setState({notification: 0}); 
                    // this.props.changeDisplayedContent(<NotificationsView changeDisplayedContent={this.props.changeDisplayedContent} 
                    //     previousActiveIcon={this.props.previousActiveIcon} onClick={this.props.onClick}></NotificationsView>)}
                    }
            >
                {notificationsIcon}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps
  )(Notifications);