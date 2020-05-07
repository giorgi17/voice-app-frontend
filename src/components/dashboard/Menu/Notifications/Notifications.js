import React, {Component} from 'react';
import NotificationsView from './NotificationsView/NotificationsView';
import { connect } from "react-redux";
import axios from 'axios';

class Notifications extends Component {
    constructor() {
        super();
        this.state = {
            notification: null
        }
    }

    componentDidMount() {
        let dataToSend = {};

        // Send user id to fetch notifications
        dataToSend.user_id = this.props.auth.user.id;

        axios.post("/api/restricted-users/get-notification-number-data", dataToSend).then(response => {
            this.setState({notification: response.data.notification});
        }).catch( err => {
            console.log(err);
        });
    }

    render() {
            // TODO: Check if there are any notifications with redux 

        let notificationsIcon = (<span className={`material-icons notifications-icon ${this.props.isNotificationActive ? "active" : ""}`}>
                                    notifications
                                </span>);
        if (this.state.notification && this.state.notification > 0) {
  
            notificationsIcon = (<div className="material-label mdl-badge" data-badge={this.state.notification}>
                                    <span className={`material-icons notifications-icon ${this.props.isNotificationActive ? "active" : ""}`}>
                                        notifications
                                    </span>
                                </div>);
        }

        return (
            <div id="notifications-container" 
                className={`menu-item ${this.props.isNotificationActive ? "active" : ""}`}
                onClick={() => {this.props.onClick("notification"); this.setState({notification: 0}); this.props.changeDisplayedContent(<NotificationsView></NotificationsView>)}}
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